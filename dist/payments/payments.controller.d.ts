import { PaymentsService } from './payments.service';
export declare class PaymentsController {
    private paymentsService;
    constructor(paymentsService: PaymentsService);
    cod(body: {
        orderId: string;
        amount: number;
    }): Promise<{
        status: string;
        method: string;
    }>;
    onlineIntent(body: {
        orderId: string;
        amount: number;
    }): Promise<{
        status: string;
        checkoutUrl: string;
        providerRef: string;
    }>;
    webhook(body: {
        orderId: string;
    }): Promise<{
        status: string;
    }>;
}
