import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from './schemas/order.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  checkout(@Req() req: any, @Body() dto: CreateOrderDto) {
    return this.ordersService.createFromCart(req.sessionId, dto);
  }

  @Patch(':id/status/:status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  updateStatus(
    @Param('id') id: string,
    @Param('status') status: OrderStatus,
    @Body() body: { trackingNumber?: string; internalNotes?: string },
  ) {
    return this.ordersService.updateStatus(id, status, body.trackingNumber, body.internalNotes);
  }

  @Get()
  list() {
    return this.ordersService.list();
  }
}


