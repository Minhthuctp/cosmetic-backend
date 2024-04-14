import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CategoryModule } from './category/category.module';
import { AdminModule } from './admin/admin.module';

const config: ConfigService = new ConfigService();

@Module({
  imports: [
    ProductModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(config.get('MONGODB_URI'), {
      dbName: 'cosmetic',
    }),
    CloudinaryModule,
    CategoryModule,
    AdminModule,
  ],
})
export class AppModule {}
