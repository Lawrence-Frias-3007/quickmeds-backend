import { SupabaseService } from '../config/supabase.service';
import { RegisterCustomerDto, RegisterRiderDto, LoginDto } from './dto/register.dto';
import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private supabase;
    private config;
    constructor(supabase: SupabaseService, config: ConfigService);
    /** Registers a customer: creates auth user + profiles row (role=customer). */
    registerCustomer(dto: RegisterCustomerDto): Promise<{
        userId: string;
        message: string;
    }>;
    /** Registers a rider: creates auth user + profiles row + rider_profiles row (unverified until admin approval). */
    registerRider(dto: RegisterRiderDto): Promise<{
        userId: string;
        message: string;
    }>;
    /** Signs in either role; Supabase issues the session JWT the app stores and sends as Bearer token. */
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        profile: any;
    }>;
}
