import {
  Injectable,
  NotFoundException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { Cart, CartDocument } from 'src/schemas/cart.schema';
import { CreateCartDto } from './dto/createCart.dto';
import { ProductService } from 'src/product/product.service';
import { create } from 'domain';
import { UpdateCartDto } from './dto/updateCart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name)
    private cartModel: Model<CartDocument>,
    private productService: ProductService,
  ) {}

  @UsePipes(new ValidationPipe({ transform: true }))
  async createCart(createCart: CreateCartDto) {
    try {
      const product = await this.productService.getProductById(
        createCart.productId,
      );
      if (!product) {
        throw new NotFoundException(
          `Product with ID ${createCart.productId} not found.`,
        );
      }
      const cart = await this.cartModel.create({
        product: createCart.productId,
        quantity: createCart.quantity,
        user: createCart.userId,
      });
      return cart;
    } catch (error) {
      console.log(error);
    }
  }

  async getCartById(id: string) {
    try {
      const cart = await this.cartModel.findById(id);
      return cart;
    } catch (error) {
      console.log(error);
    }
  }

  async getCartByIdNUserId(
    id: String,
    userId: String,
    session?: ClientSession,
  ) {
    try {
      let cartQuery = this.cartModel.findById({ _id: id, user: userId });
      if (session) {
        cartQuery = cartQuery.session(session);
      }
      const cart = await cartQuery.exec();
      return cart;
    } catch (error) {
      console.log(error);
    }
  }

  async getCartsByUser(userId: string) {
    try {
      const carts = await this.cartModel.find({ user: userId });
      return carts;
    } catch (error) {
      console.log(error);
    }
  }

  async updateCart(id: String, updateCart: UpdateCartDto, userId: string) {
    try {
      const cart = await this.cartModel.findByIdAndUpdate(
        { _id: id, user: userId },
        updateCart,
        { new: true },
      );
      return cart;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteCartByIdNUserId(id: String, userId: string) {
    try {
      const cart = await this.cartModel.findOneAndDelete({
        _id: id,
        user: userId,
      });
      return cart;
    } catch (error) {
      console.log(error);
    }
  }
}
