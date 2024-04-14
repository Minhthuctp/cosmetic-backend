import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from 'src/Schema/Product.schema';
import { Model } from 'mongoose';
import { productQuery } from './dto/productQuery.dto';
import { Request } from 'express';
import {
  defaultPage,
  defaultLimit,
  Zero,
  maxOfPrice,
} from '../constant/common';
import { buildProductOptions, buildProductSort } from './utils/helper';
import { ProductDto } from './dto/product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
  ) {}

  async getListProducts(req: Request) {
    try {
      const options: productQuery = {};
      let page = parseInt(req.query.page as any) || defaultPage;
      let limit = parseInt(req.query.limit as any) || defaultLimit;
      if (page < Zero) {
        page = defaultPage;
      }
      if (limit < Zero) {
        limit = defaultLimit;
      }
      if (req.query.productName) {
        options.productName = req.query.productName.toString();
      }

      let maxPrice: number;
      let minPrice: number;

      if (req.query.maxPrice) {
        maxPrice = parseInt(req.query.maxPrice as any) || maxOfPrice;
        options.maxPrice = maxPrice;
      }

      if (req.query.minPrice) {
        minPrice = parseInt(req.query.minPrice as any) || Zero;
        options.minPrice = minPrice;
      }

      if (minPrice > maxPrice) {
        throw Error('Max price cannot smaller than min price');
      }

      if (req.query.categories) {
        options.categories = req.query.categories.toString();
      }

      let orderBy = '';
      if (req.query.orderBy) {
        orderBy = req.query.orderBy.toString();
      }
      console.log(options);

      const products = await this.get(
        buildProductOptions(options),
        page,
        limit,
        buildProductSort(orderBy),
      );

      //   const minPrice = options.minPrice
      //     ? options.minPrice
      //     : await this.getPrice('priceAsc');
      //   const maxPrice = options.maxPrice
      //     ? options.maxPrice
      //     : await this.getPrice('priceDesc');
      //   const total = await this.count(options);

      //   return {
      //     data,
      //     total,
      //     page,
      //     last_page: Math.ceil(total / limit),
      //     minPrice,
      //     maxPrice,
      //   };
      return products;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async get(options: any, page?: number, limit?: number, sort?: any) {
    try {
      const products = await this.productModel
        .find(options)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort(sort)
        .populate(['images', 'categories']);
      return products;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async productDetails(id: string) {
    try {
      const product = await this.productModel
        .findById(id)
        .populate(['images', 'categories']);
      return product;
    } catch (error) {
      console.log(error);
    }
  }

  async createProduct(productDto: ProductDto) {
    try {
      return await this.productModel.create(productDto);
    } catch (error) {
      console.log(error);
    }
  }
}
