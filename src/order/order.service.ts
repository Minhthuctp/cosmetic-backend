import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import {
  OrderDocument,
  Order,
  OrderItem,
  DeliveryInfo,
} from 'src/schemas/order.schema';
import { CartService } from 'src/cart/cart.service';
import { ProductService } from 'src/product/product.service';
import { CreateOrderDto } from './dto/createOrder.dto';
import { NotificationService } from 'src/notification/notification.service';
import { UserService } from 'src/user/user.service';
import { Review } from 'src/schemas/Product.schema';

// create a enum to make sure that the status is one of the following and does not update reserverd status
enum OrderStatus {
  Pending = 1,
  Confirmed = 2,
  Shipping = 3,
  Completed = 4,
  Cancelled = 5,
}

@Injectable()
export class OrderService {
  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private notificationService: NotificationService,
    private userService: UserService,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  @UsePipes(new ValidationPipe({ transform: true }))
  async createOrder(createOrderDto: CreateOrderDto) {
    const session = await this.orderModel.db.startSession();
    let productInfos = [];
    session.startTransaction();
    try {
      let totalPrice = 0;
      let orderItems: OrderItem[] = [];
      for (let cartId of createOrderDto.cartItems) {
        const cart = await this.cartService.getCartByIdNUserId(
          cartId,
          createOrderDto.user,
          session,
        );

        if (!cart) {
          throw new NotFoundException(`Cart with ID ${cartId} not found.`);
        }
        const product = await this.productService.getProductById(
          cart.product,
          session,
        );
        productInfos.push(product);
        if (!product) {
          throw new NotFoundException(
            `Product with ID ${cart.product} not found.`,
          );
        }
        if (cart.quantity > product.quantity) {
          throw new BadRequestException(
            `Insufficient stock for product ${product.productName}.`,
          );
        }
        await this.productService.decrementProductQuantity(
          cart.product,
          cart.quantity,
          session,
        );
        await this.cartService.deleteCartByIdNUserId(
          cartId,
          createOrderDto.user,
        );
        totalPrice += product.price * cart.quantity;
        orderItems.push({
          productId: cart.product,
          quantity: cart.quantity,
          isReviewed: false,
        });
      }
      const orderData = {
        user: createOrderDto.user,
        orderItems: orderItems,
        payment: createOrderDto.payment,
        totalPrice: totalPrice + createOrderDto.shippingFee,
        deliveryInfo: createOrderDto.deliveryInfo,
        shippingFee: createOrderDto.shippingFee,
        status: 'pending',
      };
      if (orderData.payment.paymentMethod === 'COD') {
        orderData.status = 'confirmed';
      }

      const order = new this.orderModel(orderData);
      order.$session(session);
      const createdOrder = await order.save();
      const user = await this.userService.getUserById(createOrderDto.user);
      await this.notificationService.sendOrderConfirmationEmail(
        createdOrder,
        productInfos,
        user,
      );
      await session.commitTransaction();
      return createdOrder;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  private isValidStatus(newStatus: string): boolean {
    return (
      Object.values(OrderStatus).includes(newStatus as any) &&
      newStatus !== OrderStatus.Cancelled.toString() // Fix: Compare with the string value of OrderStatus.Cancelled
    );
  }
  // Update status and check if status is valid and do not update reserved status
  async updateOrderStatus(orderId: string, newStatus: string, userId: string) {
    try {
      if (!this.isValidStatus(newStatus)) {
        throw new Error('Invalid or reserved order status');
      }

      const order = await this.orderModel.findById({
        id: orderId,
        userId: userId,
      });
      if (!order) {
        throw new Error('Order not found');
      }

      order.status = newStatus;
      return await order.save();
    } catch (error) {
      console.log(error);
    }
  }

  // This method will change status of order to 'confirmed' and update transactionId
  async updatePaymentTransactionId(orderId: string, transactionId: string) {
    try {
      const order = await this.orderModel.findByIdAndUpdate(
        { _id: orderId },
        { 'payment.transactionId': transactionId, status: 'confirmed' },
        { new: true },
      );
      return order;
    } catch (error) {
      console.log(error);
    }
  }

  // This method will update isReviewed field of orderItem to true
  async updateOrderItemReviewStatus(
    orderId: string,
    userId: string,
    productId: string,
  ) {
    try {
      console.log(orderId, userId, productId);
      const order = await this.orderModel.findOne({
        _id: orderId,
        user: userId,
      });

      if (!order) {
        console.log('Order not found');
        return;
      }

      let isReviewed = false;
      order.orderItems.forEach((item) => {
        if (item.productId.toString() === productId && !item.isReviewed) {
          item.isReviewed = true;
          isReviewed = true;
        }
      });

      if (!isReviewed) {
        return null;
      }

      order.markModified('orderItems');
      const updatedOrder = await order.save();
      return updatedOrder;
    } catch (error) {
      console.log(error);
    }
  }

  // This method will return list of orders of user and other filter options
  async getOrdersByUser(userId: string, status?: string) {
    try {
      const orders = await this.orderModel
        .find({ user: userId, ...(status && { status: status }) })
        .sort({ createdAt: -1 });
      return orders;
    } catch (error) {
      console.log(error);
    }
  }

  // This method will return order by ID
  async getOrderById(orderId: string) {
    try {
      const order = await this.orderModel.findById(orderId);
      return order;
    } catch (error) {
      console.log(error);
    }
  }

  // This method will return order by ID
  async getOrderByIdNUserId(orderId: string, userId: string) {
    try {
      const order = await this.orderModel.findOne({
        _id: orderId,
        user: userId,
      });
      return order;
    } catch (error) {
      console.log(error);
    }
  }

  // This method will return list of orders
  async getOrders() {
    try {
      const orders = await this.orderModel.find().sort({ createdAt: -1 });
      return orders;
    } catch (error) {
      console.log(error);
    }
  }

  // This method will return list of orders by status
  async getOrdersByStatus(status: string) {
    try {
      const orders = await this.orderModel.find({ status: status });
      return orders;
    } catch (error) {
      console.log(error);
    }
  }

  // This method will update isReviewed field to true and add a review to product
  async addReviewToProduct(
    orderId: string,
    userId: string,
    productId: string,
    comment: string,
    rating: number,
  ) {
    try {
      const order = await this.updateOrderItemReviewStatus(
        orderId,
        userId,
        productId,
      );
      if (!order) {
        throw new NotFoundException(
          `Order with ID ${orderId} not found or product with ID ${productId} not found or had reviewed.`,
        );
      }
      const reviewData: Review = {
        user: userId,
        comment: comment,
        rating: rating,
      };

      const product = await this.productService.addReviewToProduct(
        productId,
        reviewData,
      );
      return product;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // This method will return for the dashboard of admin with total orders in a specific time period
  async getTotalOrderForDashBoard(from: string, to: string) {
    try {
      const numberOfOrders = await this.orderModel.countDocuments({
        createdAt: {
          $gte: new Date(from),
          $lt: new Date(to),
        },
      });
      return numberOfOrders;
    } catch (error) {
      console.log(error);
    }
  }

  // This method will return for the dashboard of admin that the number of orders on each day in a specific time period
  async getOrdersGroupByDateForDashboard(from: string, to: string) {
    try {
      const orders = await this.orderModel.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(from),
              $lt: new Date(to),
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
            },
            count: { $sum: 1 },
          },
        },
      ]);
      return orders;
    } catch (error) {
      console.log(error);
    }
  }

  // This method will return for the dashboard of admin with total orders group by status in a specific time period
  async getOrdersGroupByStatusForDashboard(from: string, to: string) {
    try {
      const orders = await this.orderModel.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(from),
              $lt: new Date(to),
            },
          },
        },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]);
      return orders;
    } catch (error) {
      console.log(error);
    }
  }

  // This method will calculate the tollal revenue in a specific time period
  async getTotalRevenue(from: string, to: string) {
    try {
      const orders = await this.orderModel
        .find({
          createdAt: {
            $gte: new Date(from),
            $lt: new Date(to),
          },
        })
        .sort({ createdAt: -1 });
      let totalRevenue = 0;
      orders.forEach((order) => {
        totalRevenue += order.totalPrice;
      });
      return totalRevenue;
    } catch (error) {
      console.log(error);
    }
  }

  // This method will return a top 10 best selling products in a specific time period
  async getTopSellingProducts(from: string, to: string) {
    try {
      const orders = await this.orderModel
        .find({
          createdAt: {
            $gte: new Date(from),
            $lt: new Date(to),
          },
        })
        .sort({ createdAt: -1 });
      let products = {};
      orders.forEach((order) => {
        order.orderItems.forEach((item) => {
          if (products[item.productId]) {
            products[item.productId] += item.quantity;
          } else {
            products[item.productId] = item.quantity;
          }
        });
      });
      let topProducts = Object.keys(products)
        .sort((a, b) => products[b] - products[a])
        .slice(0, 10);
      const topProductsWithNameNQtys = await Promise.all(
        topProducts.map(async (product) => {
          const productDetails =
            await this.productService.getProductById(product);
          return {
            productName: productDetails.productName,
            quantity: products[product],
          };
        }),
      );
      return topProductsWithNameNQtys;
    } catch (error) {
      console.log(error);
    }
  }
}
