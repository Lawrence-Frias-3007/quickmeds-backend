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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../config/supabase.service");
const config_1 = require("@nestjs/config");
const supabase_js_1 = require("@supabase/supabase-js");
let AuthService = class AuthService {
    constructor(supabase, config) {
        this.supabase = supabase;
        this.config = config;
    }
    /** Registers a customer: creates auth user + profiles row (role=customer). */
    async registerCustomer(dto) {
        const client = this.supabase.getClient();
        const { data, error } = await client.auth.admin.createUser({
            email: dto.email,
            password: dto.password,
            email_confirm: true,
            user_metadata: { role: 'customer', full_name: dto.fullName },
        });
        if (error)
            throw new common_1.BadRequestException(error.message);
        const { error: profileErr } = await client.from('profiles').insert({
            id: data.user.id,
            role: 'customer',
            full_name: dto.fullName,
            phone: dto.phone,
        });
        if (profileErr)
            throw new common_1.BadRequestException(profileErr.message);
        return { userId: data.user.id, message: 'Customer registered. Please sign in.' };
    }
    /** Registers a rider: creates auth user + profiles row + rider_profiles row (unverified until admin approval). */
    async registerRider(dto) {
        const client = this.supabase.getClient();
        const { data, error } = await client.auth.admin.createUser({
            email: dto.email,
            password: dto.password,
            email_confirm: true,
            user_metadata: { role: 'rider', full_name: dto.fullName },
        });
        if (error)
            throw new common_1.BadRequestException(error.message);
        const { error: profileErr } = await client.from('profiles').insert({
            id: data.user.id,
            role: 'rider',
            full_name: dto.fullName,
            phone: dto.phone,
        });
        if (profileErr)
            throw new common_1.BadRequestException(profileErr.message);
        const { error: riderErr } = await client.from('rider_profiles').insert({
            id: data.user.id,
            vehicle_type: dto.vehicleType,
            plate_number: dto.plateNumber,
            license_number: dto.licenseNumber,
            license_photo_url: dto.licensePhotoUrl,
            is_verified: false,
        });
        if (riderErr)
            throw new common_1.BadRequestException(riderErr.message);
        return {
            userId: data.user.id,
            message: 'Rider registered. Your documents are pending verification before you can go online.',
        };
    }
    /** Signs in either role; Supabase issues the session JWT the app stores and sends as Bearer token. */
    async login(dto) {
        const client = (0, supabase_js_1.createClient)(this.config.get('SUPABASE_URL'), this.config.get('SUPABASE_ANON_KEY'), {
            auth: {
                persistSession: false,
            },
        });
        const { data, error } = await client.auth.signInWithPassword({
            email: dto.email,
            password: dto.password,
        });
        if (error)
            throw new common_1.UnauthorizedException(error.message);
        const { data: profile } = await client
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
        return {
            accessToken: data.session.access_token,
            refreshToken: data.session.refresh_token,
            profile,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map