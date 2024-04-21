import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import mongoose, { Document } from 'mongoose';

export type OrderDocument = Order & Document;

export class OrderItem {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  })
  @ApiProperty()
  productId: string;

  @ApiProperty()
  @Prop({ required: true })
  quantity: number;
}

export class DeliveryInfo {
  @Prop({ required: true })
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  shippingCustomerName: string;

  @ApiProperty()
  @Prop({ required: true })
  @IsNotEmpty()
  @IsString()
  shippingDistrictCode: string;

  @ApiProperty()
  @Prop({ required: true })
  @IsNotEmpty()
  @IsString()
  shippingDistrictName: string;

  @ApiProperty()
  @Prop({ required: true })
  @IsNotEmpty()
  @IsString()
  shippingWardName: string;

  @ApiProperty()
  @Prop({ required: true })
  @IsNotEmpty()
  @IsString()
  shippingWardCode: string;

  @ApiProperty()
  @Prop({ required: true })
  @IsNotEmpty()
  @IsString()
  shippingProvinceCode: string;

  @ApiProperty()
  @Prop({ required: true })
  @IsNotEmpty()
  @IsString()
  shippingProvinceName: string;

  @ApiProperty()
  @Prop({ required: true })
  @IsNotEmpty()
  @IsString()
  shippingFullAddress: string;
}

export class Payment {
  @ApiProperty()
  @Prop({ required: true })
  @IsNotEmpty()
  @IsString()
  paymentMethod: string;

  @Prop()
  @ApiProperty({ required: false })
  transactionId: string;
}

@Schema({ timestamps: true })
export class Order {
  @ApiProperty({ type: () => [OrderItem] })
  @Prop({ required: true, type: [OrderItem], default: [] })
  orderItems: OrderItem[];

  @ApiProperty()
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  user: string;

  @ApiProperty()
  @Prop({ required: true, type: Payment, default: {} })
  payment: Payment;

  @ApiProperty()
  @Prop({ required: true, type: DeliveryInfo, default: {} })
  DeliveryInfo: DeliveryInfo;

  // @ApiProperty()
  // @Prop({ required: true })
  // shippingTime: string;

  // @ApiProperty()
  // @Prop({ required: true })
  // shippingFee: number;

  @ApiProperty()
  @Prop({ required: true })
  totalPrice: number;

  @ApiProperty()
  @Prop({
    required: true,
    enum: ['pending', 'confirmed', 'shipping', 'completed', 'cancelled'],
  })
  status: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
