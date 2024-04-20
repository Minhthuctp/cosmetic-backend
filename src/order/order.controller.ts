import { Controller, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/guards/roles.guards';

@Controller('order')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrderController {}
