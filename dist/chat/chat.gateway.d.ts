import { Server, Socket } from 'socket.io';
import { SupabaseService } from '../config/supabase.service';
/** Per-order chat between the customer and their assigned rider. */
export declare class ChatGateway {
    private supabase;
    server: Server;
    constructor(supabase: SupabaseService);
    handleJoin(client: Socket, data: {
        orderId: string;
    }): void;
    handleMessage(data: {
        orderId: string;
        senderId: string;
        message: string;
    }): Promise<any>;
}
