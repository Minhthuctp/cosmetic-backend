import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { Cart, CartSchema } from 'src/schemas/cart.schema';
import { Order, OrderSchema } from 'src/schemas/order.schema';
import { Product, ProductSchema } from 'src/schemas/Product.schema';
import { Category, CategorySchema } from 'src/schemas/category.schema';
import { Image, ImageSchema } from 'src/schemas/image.schema';
import { CartService } from 'src/cart/cart.service';
import { ProductService } from 'src/product/product.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Cart.name,
        schema: CartSchema,
      },
      {
        name: Order.name,
        schema: OrderSchema,
      },
      { name: Product.name, schema: ProductSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Image.name, schema: ImageSchema },
    ]),
  ],
  providers: [OrderService, CartService, ProductService],
  controllers: [OrderController],
})
export class OrderModule {}
