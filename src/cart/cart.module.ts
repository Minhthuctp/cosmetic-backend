import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from '../schemas/product.schema';
import { CartItem, CartItemSchema } from 'src/schemas/cart.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { ProductService } from 'src/product/product.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { CategoryService } from 'src/category/category.service';
import { Category, CategorySchema } from 'src/schemas/category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CartItem.name,
        schema: CartItemSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
      { name: Product.name, schema: ProductSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  providers: [
    JwtService,
    UserService,
    ProductService,
    CategoryService,
    CartService,
  ],
  exports: [CartService],
  controllers: [CartController],
})
export class CartModule {}
