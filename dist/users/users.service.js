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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../config/supabase.service");
let UsersService = class UsersService {
    constructor(supabase) {
        this.supabase = supabase;
    }
    async getProfile(userId) {
        const client = this.supabase.getClient();
        // Get profile
        const { data: profile, error } = await client
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
        if (error)
            throw error;
        // Get email from Supabase Auth
        const { data: authUser, error: authError } = await client.auth.admin.getUserById(userId);
        if (authError)
            throw authError;
        return {
            ...profile,
            email: authUser.user.email,
        };
    }
    /** Updates editable profile fields (full name, phone) for the current
     * user — customer or rider alike, since both share the `profiles` table.
     * Email is intentionally excluded: it lives in Supabase Auth and isn't
     * writable through this endpoint. Returns the refreshed profile,
     * including the email, so the client can just re-render from the result. */
    async updateProfile(userId, body) {
        const client = this.supabase.getClient();
        const updates = {};
        if (typeof body.full_name === 'string' && body.full_name.trim().length > 0) {
            updates.full_name = body.full_name.trim();
        }
        if (typeof body.phone === 'string' && body.phone.trim().length > 0) {
            updates.phone = body.phone.trim();
        }
        if (Object.keys(updates).length > 0) {
            const { error } = await client
                .from('profiles')
                .update({ ...updates, updated_at: new Date().toISOString() })
                .eq('id', userId);
            if (error)
                throw error;
        }
        return this.getProfile(userId);
    }
    /** Saves the customer's delivery address with lat/lng captured from the
     * Flutter location picker (required during account setup / first order). */
    async addAddress(userId, body) {
        const client = this.supabase.getClient();
        const { data, error } = await client
            .from('addresses')
            .insert({
            user_id: userId,
            label: body.label,
            address_type: body.address_type,
            address_line: body.addressLine,
            landmark: body.landmark,
            latitude: body.lat,
            longitude: body.lng,
            is_default: body.isDefault ?? false,
        })
            .select()
            .single();
        if (error)
            throw error;
        return data;
    }
    async listAddresses(userId) {
        const client = this.supabase.getClient();
        const { data, error } = await client.from('addresses').select('*').eq('user_id', userId);
        if (error)
            throw error;
        return data;
    }
    /** Rider toggles availability; only verified riders can go online. */
    async setRiderOnline(riderId, online) {
        const client = this.supabase.getClient();
        const { data, error } = await client
            .from('rider_profiles')
            .update({ is_online: online })
            .eq('id', riderId)
            .eq('is_verified', true)
            .select()
            .single();
        if (error)
            throw error;
        return data;
    }
    async getPreferences(userId) {
        const client = this.supabase.getClient();
        const { data, error } = await client
            .from('user_preferences')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();
        if (error)
            throw error;
        if (!data) {
            const { data: created, error: insertError } = await client
                .from('user_preferences')
                .insert({
                user_id: userId,
            })
                .select()
                .single();
            if (insertError)
                throw insertError;
            return created;
        }
        return data;
    }
    async updatePreferences(userId, body) {
        console.log('Preferences received:', body);
        const client = this.supabase.getClient();
        const { data, error } = await client
            .from('user_preferences')
            .upsert({
            user_id: userId,
            notifications: body.notifications,
            order_updates: body.order_updates,
            dark_mode: body.dark_mode,
        })
            .select()
            .single();
        if (error) {
            console.error(error);
            throw error;
        }
        console.log('Preferences saved:', data);
        return data;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], UsersService);
//# sourceMappingURL=users.service.js.map