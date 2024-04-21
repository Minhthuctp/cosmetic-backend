import { ApiProperty } from '@nestjs/swagger';
import { DeliveryInfo, Payment } from 'src/schemas/order.schema';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  carts: String[];

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  user: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @Type(() => Payment)
  payment: Payment;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => DeliveryInfo)
  deliveryInfo: DeliveryInfo;
}