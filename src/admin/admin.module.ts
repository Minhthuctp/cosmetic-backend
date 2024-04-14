import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { ProductService } from 'src/product/product.service';
import { CategoryService } from 'src/category/category.service';
import { ImageService } from 'src/image/image.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from 'src/Schema/Product.schema';
import { Category, CategorySchema } from 'src/Schema/category.schema';
import { Image, ImageSchema } from 'src/Schema/image.schema';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Image.name, schema: ImageSchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [
    ProductService,
    CloudinaryService,
    CategoryService,
    ImageService,
    AdminService,
  ],
})
export class AdminModule {}
