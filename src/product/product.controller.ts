import {
  Controller,
  Get,
  Post,
  Param,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  async products(@Req() req: Request) {
    return this.productService.getListProducts(req);
  }

  @Get(':id')
  async productDetail(@Param('id') id: string) {
    const productDetail = await this.productService.productDetails(id);
    // const categories = productDetail.categories[0]._id;

    // const similarProducts =
    //   await this.productService.similarProducts({
    //     categories: categories,
    //   });

    if (!productDetail) {
      throw new HttpException('Product is not found', HttpStatus.BAD_REQUEST);
    }

    return {
      productDetail: {
        ...productDetail['_doc'],
        // similarProducts: similarProducts,
      },
      // similarProducts: similarProducts,
    };
  }
}
