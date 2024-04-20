import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { CategoryService } from 'src/category/category.service';
import { ImageService } from 'src/image/image.service';
import { ProductService } from 'src/product/product.service';
import { Zero, invalidPrice, invalidQuantity } from 'src/constant/common';
import { RolesGuard } from 'src/guards/roles.guards';
import { Roles } from 'src/guards/roles.decorator';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private imageService: ImageService,
  ) {}

  @Post('createProduct')
  @Roles('admin')
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

  @Post('createCategory')
  @Roles('admin')
  async createCatetory(@Req() req: Request) {
    const newCategory: any = {
      name: req.body.name,
    };

    const category = await this.categoryService.createCategory(newCategory);
    if (!category) {
      throw new HttpException(
        'Failed to create new category',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return category;
  }

  @Patch('updateProduct/:id')
  @Roles('admin')
  async updateProduct(@Req() req: Request, @Param('id') id: string) {
    let product: any = {};
    if (req.body.price) {
      product.price = parseInt(req.body.price as any) || invalidPrice;
      if (product.price < Zero) {
        throw new HttpException('Price is invalid', HttpStatus.BAD_REQUEST);
      }
    }
    if (req.body.quantity) {
      product.quantity = parseInt(req.body.quantity as any) || invalidQuantity;
      if (product.quantity < Zero) {
        throw new HttpException('Quantity is invalid', HttpStatus.BAD_REQUEST);
      }
    }

    const productUpdate = await this.productService.updateProduct(id, product);
    if (!productUpdate) {
      throw new HttpException(
        'Failed to update product',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return productUpdate;
  }

  @Patch('updateCategory/:id')
  @Roles('admin')
  async updateCategory(@Req() req: Request, @Param('id') id: string) {
    let category: any = {};
    if (req.body.name) {
      category.name = String(req.body.name as any) || '';
      if (category.name.length == 0) {
        throw new HttpException('Name is invalid', HttpStatus.BAD_REQUEST);
      }
    }

    const categoryUpdate = await this.categoryService.updateCategory(
      id,
      category,
    );
    if (!categoryUpdate) {
      throw new HttpException(
        'Failed to update category',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return categoryUpdate;
  }
}
