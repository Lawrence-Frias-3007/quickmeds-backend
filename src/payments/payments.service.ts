import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from '../config/supabase.service';

@Injectable()
export class PaymentsService {
  constructor(private supabase: SupabaseService, private config: ConfigService) {}

  /** Cash on delivery: no online transaction, payment is settled at hand-off. */
  async confirmCashOnDelivery(orderId: string, amount: number) {
    const client = this.supabase.getClient();
    await client.from('payment_transactions').insert({
      order_id: orderId,
      provider: 'cod',
      amount,
      status: 'pending', // flips to 'paid' when rider marks delivered + collects cash
    });
    return { status: 'pending', method: 'cash_on_delivery' };
  }

  /**
   * Online payment: in production, call your payment provider (e.g. PayMongo
   * for PH GCash/cards, or Stripe) to create a payment intent and return the
   * client secret / checkout URL for the Flutter app to open. This stub
   * shows the shape of that integration.
   */
  async createOnlinePaymentIntent(orderId: string, amount: number) {
    const client = this.supabase.getClient();
    const providerRef = `pi_${Date.now()}`; // replace with real provider response id

    await client.from('payment_transactions').insert({
      order_id: orderId,
      provider: 'paymongo',
      provider_ref: providerRef,
      amount,
      status: 'pending',
    });

    return {
      status: 'requires_action',
      checkoutUrl: `https://checkout.example-provider.com/${providerRef}`,
      providerRef,
    };
  }

  async markPaid(orderId: string) {
    const client = this.supabase.getClient();
    await client.from('payment_transactions').update({ status: 'paid' }).eq('order_id', orderId);
    await client.from('orders').update({ payment_status: 'paid' }).eq('id', orderId);
    return { status: 'paid' };
  }
}
