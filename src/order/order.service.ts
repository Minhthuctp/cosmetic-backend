import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ClientSession } from 'mongoose';
import { OrderDocument, Order } from 'src/schemas/order.schema';
import { CartService } from 'src/cart/cart.service';
import { ProductService } from 'src/product/product.service';
import { Cart } from 'src/schemas/cart.schema';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private cartService: CartService,
    private productService: ProductService,
  ) {}

  async createOrderFromCart(cartId: string, userId: string): Promise<Order> {
    const session = await this.orderModel.db.startSession();
    session.startTransaction();

    try {
      // Retrieve cart data
      //   const cart = await this.cartService.getCartById(cartId, session);
      let cart: Cart;
      if (!cart) {
        throw new NotFoundException(`Cart with ID ${cartId} not found.`);
      }

      // Validate cart items
      for (const item of cart.items) {
        const product = await this.productService.getProductById(
          item.productId,
          session,
        );
        if (!product) {
          throw new NotFoundException(
            `Product with ID ${item.productId} not found.`,
          );
        }
        if (item.quantity > product.quantity) {
          throw new BadRequestException(
            `Insufficient stock for product ${product.productName}.`,
          );
        }
      }

      // Create order
      const orderData = {
        orderItems: cart.items,
        user: userId,
      };
      const createdOrder = new this.orderModel(orderData);
      await createdOrder.save({ session });

      for (const item of cart.items) {
        await this.productService.decrementProductQuantity(
          item.productId,
          item.quantity,
          session,
        );
      }

      await session.commitTransaction();
      session.endSession();

      return createdOrder;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
}
