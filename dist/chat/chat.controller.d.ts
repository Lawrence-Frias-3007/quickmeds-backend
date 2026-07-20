import { SupabaseService } from '../config/supabase.service';
export declare class ChatController {
    private supabase;
    constructor(supabase: SupabaseService);
    history(orderId: string): Promise<any[]>;
}
