import {
  Controller,
  Get,
  Post,
  Param,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { ProductService } from './product.service';
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

@Controller('product')
@ApiTags('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  @ApiOperation({ summary: 'Get list of products' })
  @ApiQuery({ name: 'productName', type: String, required: false })
  @ApiQuery({
    name: 'categories',
    type: String,
    description: 'ObjectId of category',
    required: false,
  })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'minPrice', type: Number, required: false })
  @ApiQuery({ name: 'maxPrice', type: Number, required: false })
  @ApiQuery({
    name: 'sortBy',
    type: String,
    enum: ['priceAsc', 'priceDesc', 'createAt'],
    required: false,
  })
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
