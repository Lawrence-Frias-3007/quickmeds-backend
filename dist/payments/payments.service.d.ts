import { ConfigService } from '@nestjs/config';
import { SupabaseService } from '../config/supabase.service';
export declare class PaymentsService {
    private supabase;
    private config;
    constructor(supabase: SupabaseService, config: ConfigService);
    /** Cash on delivery: no online transaction, payment is settled at hand-off. */
    confirmCashOnDelivery(orderId: string, amount: number): Promise<{
        status: string;
        method: string;
    }>;
    /**
     * Online payment: in production, call your payment provider (e.g. PayMongo
     * for PH GCash/cards, or Stripe) to create a payment intent and return the
     * client secret / checkout URL for the Flutter app to open. This stub
     * shows the shape of that integration.
     */
    createOnlinePaymentIntent(orderId: string, amount: number): Promise<{
        status: string;
        checkoutUrl: string;
        providerRef: string;
    }>;
    markPaid(orderId: string): Promise<{
        status: string;
    }>;
}
