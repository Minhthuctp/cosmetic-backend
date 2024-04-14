import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  //ValidateNested,
} from 'class-validator';
import { ImageDto } from 'src/image/dto/image.dto';
import { CategoryDto } from 'src/category/dto/category.dto';

export class ProductDto {
  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsOptional()
  shortDescription: string;

  @IsString()
  @IsOptional()
  additionalInfos: string;

  @IsString()
  @IsOptional()
  productSKU: string;

  @IsArray()
  @Type(() => ImageDto)
  @IsOptional()
  images: ImageDto[];

  @IsArray()
  @Type(() => CategoryDto)
  categories: CategoryDto[];
}
