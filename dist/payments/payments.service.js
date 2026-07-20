"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const supabase_service_1 = require("../config/supabase.service");
let PaymentsService = class PaymentsService {
    constructor(supabase, config) {
        this.supabase = supabase;
        this.config = config;
    }
    /** Cash on delivery: no online transaction, payment is settled at hand-off. */
    async confirmCashOnDelivery(orderId, amount) {
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
    async createOnlinePaymentIntent(orderId, amount) {
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
    async markPaid(orderId) {
        const client = this.supabase.getClient();
        await client.from('payment_transactions').update({ status: 'paid' }).eq('order_id', orderId);
        await client.from('orders').update({ payment_status: 'paid' }).eq('id', orderId);
        return { status: 'paid' };
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService, config_1.ConfigService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map