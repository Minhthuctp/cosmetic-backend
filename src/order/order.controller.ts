import {
  Body,
  Controller,
  ForbiddenException,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/guards/roles.guards';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/createOrder.dto';
import { Request } from 'express';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/schemas/user.schema';
import { Order } from 'src/schemas/order.schema';

@Controller('order')
@ApiTags('order')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post('/createOrder')
  @ApiOkResponse({
    description: 'The created order records',
    type: Order,
  })
  @UsePipes(ValidationPipe)
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Req() req: Request & { user: { id: string } },
  ) {
    console.log(req.user, createOrderDto.user);
    if (createOrderDto.user !== req.user.id) {
      throw new ForbiddenException('You can only create your own orders');
    }
    return this.orderService.createOrder(createOrderDto);
  }
}
