import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { CategoryService } from 'src/category/category.service';
import { ImageService } from 'src/image/image.service';
import { ProductService } from 'src/product/product.service';
import { Zero } from 'src/constant/common';

@Controller('admin')
export class AdminController {
  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private imageService: ImageService,
  ) {}
  @Post('createProduct')
  @UseInterceptors(FilesInterceptor('images'))
  async createProduct(
    @Req() req: Request,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const newProduct: any = {
      productName: req.body.productName,
      price: parseFloat(req.body.price),
      categories: req.body.categories,
      description: req.body.description,
      shortDescription: req.body.shortDescription,
      productSKU: req.body.productSKU,
      additionalInfos: req.body.additionalInfos,
      quantity: req.body.quantity,
    };
    const fileList = await this.imageService.uploadImages(files);
    // ** Save images url to our mongoDB collections
    let imgs = [];
    for (let i = Zero; i < fileList.length; i++) {
      const img = fileList[i];
      const image = await this.imageService.createImage(img);
      imgs.push(image.id);
    }
    // console.log(imgs);
    // ** Get array of image's id and add to our product
    newProduct.images = imgs;
    const product = await this.productService.createProduct(newProduct);
    if (!product) {
      throw new HttpException(
        'Failed to create new product',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return product;
  }
}
