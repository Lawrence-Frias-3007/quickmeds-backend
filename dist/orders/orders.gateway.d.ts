import { Server, Socket } from 'socket.io';
import { SupabaseService } from '../config/supabase.service';
/**
 * Live tracking channel. The rider app emits 'rider:location' every few
 * seconds while an order is active; we persist it and broadcast it to the
 * room named after the order so the customer's map marker updates in
 * real time (this mirrors what the customer sees on the order-tracking
 * screen: "shows the location of the rider").
 */
export declare class OrdersGateway {
    private supabase;
    server: Server;
    constructor(supabase: SupabaseService);
    handleJoin(client: Socket, data: {
        orderId: string;
    }): void;
    handleRiderLocation(data: {
        orderId: string;
        riderId: string;
        lat: number;
        lng: number;
        heading?: number;
    }): Promise<void>;
    handleStatus(data: {
        orderId: string;
        status: string;
    }): void;
}
