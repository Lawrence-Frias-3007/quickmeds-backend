import { SupabaseService } from '../config/supabase.service';
export declare class UsersService {
    private supabase;
    constructor(supabase: SupabaseService);
    getProfile(userId: string): Promise<any>;
    /** Updates editable profile fields (full name, phone) for the current
     * user — customer or rider alike, since both share the `profiles` table.
     * Email is intentionally excluded: it lives in Supabase Auth and isn't
     * writable through this endpoint. Returns the refreshed profile,
     * including the email, so the client can just re-render from the result. */
    updateProfile(userId: string, body: {
        full_name?: string;
        phone?: string;
    }): Promise<any>;
    /** Saves the customer's delivery address with lat/lng captured from the
     * Flutter location picker (required during account setup / first order). */
    addAddress(userId: string, body: any): Promise<any>;
    listAddresses(userId: string): Promise<any[]>;
    /** Rider toggles availability; only verified riders can go online. */
    setRiderOnline(riderId: string, online: boolean): Promise<any>;
    getPreferences(userId: string): Promise<any>;
    updatePreferences(userId: string, body: any): Promise<any>;
}
