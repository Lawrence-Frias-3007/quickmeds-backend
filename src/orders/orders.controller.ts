import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';

@UseGuards(SupabaseAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  create(@Req() req: any, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(req.user.id, dto);
  }

  @Get('mine')
  mine(@Req() req: any) {
    return this.ordersService.findForCustomer(req.user.id);
  }

  @Get('available')
  available() {
    return this.ordersService.findAvailableForRiders();
  }

  @Get('rider/mine')
  riderMine(@Req() req: any) {
    return this.ordersService.findForRider(req.user.id);
  }

  @Patch(':id/accept')
  accept(@Req() req: any, @Param('id') id: string) {
    return this.ordersService.acceptOrder(req.user.id, id);
  }

  @Patch(':id/status')
  updateStatus(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: { status: string; prescriptionCollected?: boolean },
  ) {
    return this.ordersService.updateStatus(req.user.id, id, body.status, body.prescriptionCollected);
  }
}
