import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { ProductService } from 'src/product/product.service';
import { CategoryService } from 'src/category/category.service';
import { ImageService } from 'src/image/image.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from 'src/schemas/Product.schema';
import { Category, CategorySchema } from 'src/schemas/category.schema';
import { Image, ImageSchema } from 'src/schemas/image.schema';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { JwtService } from '@nestjs/jwt';
import { OrderService } from 'src/order/order.service';
import { CartService } from 'src/cart/cart.service';
import { NotificationService } from 'src/notification/notification.service';
import { UserService } from 'src/user/user.service';
import { OrderModule } from 'src/order/order.module';
import { Order, OrderSchema } from 'src/schemas/order.schema';
import { CartItem, CartItemSchema } from 'src/schemas/cart.schema';
import { User, UserSchema } from 'src/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Image.name, schema: ImageSchema },
      { name: Order.name, schema: OrderSchema },
      { name: CartItem.name, schema: CartItemSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [
    JwtService,
    OrderService,
    CartService,
    NotificationService,
    UserService,
    ProductService,
    CloudinaryService,
    CategoryService,
    ImageService,
    AdminService,
  ],
})
export class AdminModule {}
