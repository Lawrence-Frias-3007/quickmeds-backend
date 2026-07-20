import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';

@UseGuards(SupabaseAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('cod/confirm')
  cod(@Body() body: { orderId: string; amount: number }) {
    return this.paymentsService.confirmCashOnDelivery(body.orderId, body.amount);
  }

  @Post('online/intent')
  onlineIntent(@Body() body: { orderId: string; amount: number }) {
    return this.paymentsService.createOnlinePaymentIntent(body.orderId, body.amount);
  }

  @Post('online/webhook')
  webhook(@Body() body: { orderId: string }) {
    // In production, verify the provider's webhook signature before trusting this.
    return this.paymentsService.markPaid(body.orderId);
  }
}
