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
import { stat } from 'fs';

@Injectable()
export class OrderService {
  constructor(
    private cartService: CartService,
    private productService: ProductService,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  @UsePipes(new ValidationPipe({ transform: true }))
  async createOrder(createOrderDto: CreateOrderDto) {
    // const session = await this.orderModel.db.startSession();
    // session.startTransaction();
    try {
      let totalPrice = 0;
      let orderItems: OrderItem[] = [];
      // console.log(createOrderDto.carts);
      for (let cartId of createOrderDto.carts) {
        console.log(cartId);
        const cart = await this.cartService.getCartByIdNUserId(
          cartId,
          createOrderDto.user,
          // session,
        );
        if (!cart) {
          throw new NotFoundException(`Cart with ID ${cartId} not found.`);
        }
        const product = await this.productService.getProductById(
          cart.product,
          // session,
        );
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
          // session,
        );
        await this.cartService.deleteCartByIdNUserId(
          cartId,
          createOrderDto.user,
        );
        totalPrice += product.price * cart.quantity;
        orderItems.push({
          productId: cart.product,
          quantity: cart.quantity,
        });
      }
      const orderData = {
        user: createOrderDto.user,
        orderItems: orderItems,
        payment: createOrderDto.payment,
        totalPrice: totalPrice,
        deliveryInfo: createOrderDto.deliveryInfo,
        status: 'pending',
      };
      if (orderData.payment.paymentMethod === 'COD') {
        orderData.status = 'confirmed';
      }

      const createdOrder = await this.orderModel.create(orderData);
      // , {
      //   // session: session,
      // });
      return createdOrder;
    } catch (error) {
      // await session.abortTransaction();
      // session.endSession();
      throw error;
    }
  }
}
