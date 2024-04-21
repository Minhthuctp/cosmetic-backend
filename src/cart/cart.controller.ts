import {
  Body,
  Controller,
  ForbiddenException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/createCart.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/guards/roles.guards';
import { Roles } from 'src/guards/roles.decorator';
import { Request } from 'express';
import { UpdateCartDto } from './dto/updateCart.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('cart')
@ApiTags('cart')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CartController {
  constructor(private cartService: CartService) {}

  @Post('/createCart')
  @Roles('user')
  async createCart(
    @Body() createCartDto: CreateCartDto,
    @Req() req: Request & { user: { id: string } },
  ) {
    if (createCartDto.userId !== req.user.id) {
      throw new ForbiddenException('You can only create your own cart');
    }
    return this.cartService.createCart(createCartDto);
  }

  @Patch('/updateCart/:id')
  @Roles('user')
  async updateCart(
    @Body() updateCartDto: UpdateCartDto,
    @Req() req: Request & { user: { id: string } },
    @Param('id') id: string,
  ) {
    return this.cartService.updateCart(id, updateCartDto, req.user.id);
  }
}
