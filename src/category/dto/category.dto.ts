import { IsMongoId, IsNotEmpty } from 'class-validator';

export class CategoryDto {
  @IsMongoId()
  @IsNotEmpty()
  id: string;
}

export class CategoryDetails {
  @IsNotEmpty()
  name: string;
}
