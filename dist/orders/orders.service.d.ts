import { SupabaseService } from '../config/supabase.service';
import { PrescriptionsService } from '../prescriptions/prescriptions.service';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrdersService {
    private supabase;
    private prescriptionsService;
    constructor(supabase: SupabaseService, prescriptionsService: PrescriptionsService);
    /** Checkout: validates stock/Rx rules, snapshots line items, creates the order. */
    create(customerId: string, dto: CreateOrderDto): Promise<any>;
    findForCustomer(customerId: string): Promise<any[]>;
    /** Orders visible to riders looking for work: pending, unassigned. */
    findAvailableForRiders(): Promise<any[]>;
    findForRider(riderId: string): Promise<any[]>;
    acceptOrder(riderId: string, orderId: string): Promise<any>;
    /**
     * Status transitions the rider drives from the delivery app:
     * accepted -> rider_to_pharmacy -> picked_up -> on_the_way -> delivered.
     * When requires_prescription_pickup is true, 'picked_up' is only reachable
     * after the rider confirms physical collection of the paper Rx (enforced
     * client-side with a confirmation step, and logged here via notes).
     */
    updateStatus(riderId: string, orderId: string, status: string, prescriptionCollected?: boolean): Promise<any>;
}
