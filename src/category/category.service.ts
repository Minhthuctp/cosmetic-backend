import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from 'src/Schema/category.schema';
import { Model } from 'mongoose';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private categoryModel: Model<CategoryDocument>,
  ) {}

  async getListCategories() {
    try {
      const categories = await this.categoryModel.find({});
      return categories;
    } catch (error) {
      console.log(error);
    }
  }

  async getCategoryByIds(ids: string[]) {
    try {
      const categories = await this.categoryModel.find({
        categories: { $in: ids },
      });
      return categories;
    } catch (error) {
      console.log(error);
    }
  }
}
