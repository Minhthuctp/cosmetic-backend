import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { CartItem, CartItemSchema } from 'src/schemas/cart.schema';
import { Order, OrderSchema } from 'src/schemas/order.schema';
import { Product, ProductSchema } from '../schemas/product.schema';
import { Category, CategorySchema } from 'src/schemas/category.schema';
import { Image, ImageSchema } from 'src/schemas/image.schema';
import { CartService } from 'src/cart/cart.service';
import { ProductService } from 'src/product/product.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CartModule } from 'src/cart/cart.module';
import { CategoryModule } from 'src/category/category.module';
import { NotificationService } from 'src/notification/notification.service';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [
    CartModule,
    CategoryModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: CartItem.name,
        schema: CartItemSchema,
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
  providers: [
    CartService,
    ProductService,
    NotificationService,
    UserService,
    JwtService,
    ConfigService,
    OrderService,
  ],
  controllers: [OrderController],
})
export class OrderModule {}
