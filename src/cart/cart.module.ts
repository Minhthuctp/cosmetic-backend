import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from 'src/schemas/Product.schema';
import { Cart, CartSchema } from 'src/schemas/cart.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { ProductService } from 'src/product/product.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Cart.name,
        schema: CartSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },

      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  providers: [JwtService, UserService, ProductService, CartService],
  exports: [CartService],
  controllers: [CartController],
})
export class CartModule {}
