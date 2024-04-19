import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type OrderDocument = Order & Document;

export class OrderItem {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  })
  productId: string;

  @Prop({ required: true })
  quantity: number;
}

export class DeliveryInfo {
  @Prop({ required: true })
  shippingCustomerName: string;

  @Prop({ required: true })
  shippingDistrictCode: string;

  @Prop({ required: true })
  shippingDistrictName: string;

  @Prop({ required: true })
  shippingWardName: string;

  @Prop({ required: true })
  shippingWardCode: string;

  @Prop({ required: true })
  shippingProvinceCode: string;

  @Prop({ required: true })
  shippingProvinceName: string;

  @Prop({ required: true })
  shippingFullAddress: string;
}

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, type: [OrderItem], default: [] })
  orderItems: OrderItem[];

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  user: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
  })
  payment: string;

  @Prop({ required: true, type: DeliveryInfo, default: {} })
  DeliveryInfo: DeliveryInfo;

  @Prop({ required: true })
  shippingTime: string;

  @Prop({ required: true })
  shippingFee: number;

  @Prop({ required: true })
  totalPrice: number;

  @Prop({ required: true })
  status: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
