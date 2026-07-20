import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../config/supabase.service';
import { RegisterCustomerDto, RegisterRiderDto, LoginDto } from './dto/register.dto';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class AuthService {
  constructor(
  private supabase: SupabaseService,
  private config: ConfigService,
) {}

  /** Registers a customer: creates auth user + profiles row (role=customer). */
  async registerCustomer(dto: RegisterCustomerDto) {
    const client = this.supabase.getClient();
    const { data, error } = await client.auth.admin.createUser({
      email: dto.email,
      password: dto.password,
      email_confirm: true,
      user_metadata: { role: 'customer', full_name: dto.fullName },
    });
    if (error) throw new BadRequestException(error.message);

    const { error: profileErr } = await client.from('profiles').insert({
      id: data.user.id,
      role: 'customer',
      full_name: dto.fullName,
      phone: dto.phone,
    });
    if (profileErr) throw new BadRequestException(profileErr.message);

    return { userId: data.user.id, message: 'Customer registered. Please sign in.' };
  }

  /** Registers a rider: creates auth user + profiles row + rider_profiles row (unverified until admin approval). */
  async registerRider(dto: RegisterRiderDto) {
    const client = this.supabase.getClient();
    const { data, error } = await client.auth.admin.createUser({
      email: dto.email,
      password: dto.password,
      email_confirm: true,
      user_metadata: { role: 'rider', full_name: dto.fullName },
    });
    if (error) throw new BadRequestException(error.message);

    const { error: profileErr } = await client.from('profiles').insert({
      id: data.user.id,
      role: 'rider',
      full_name: dto.fullName,
      phone: dto.phone,
    });
    if (profileErr) throw new BadRequestException(profileErr.message);

    const { error: riderErr } = await client.from('rider_profiles').insert({
      id: data.user.id,
      vehicle_type: dto.vehicleType,
      plate_number: dto.plateNumber,
      license_number: dto.licenseNumber,
      license_photo_url: dto.licensePhotoUrl,
      is_verified: false,
    });
    if (riderErr) throw new BadRequestException(riderErr.message);

    return {
      userId: data.user.id,
      message: 'Rider registered. Your documents are pending verification before you can go online.',
    };
  }

  /** Signs in either role; Supabase issues the session JWT the app stores and sends as Bearer token. */
  async login(dto: LoginDto) {
    const client = createClient(
      this.config.get<string>('SUPABASE_URL')!,
      this.config.get<string>('SUPABASE_ANON_KEY')!,
      {
        auth: {
          persistSession: false,
        },
      },
    );
    const { data, error } = await client.auth.signInWithPassword({
      email: dto.email,
      password: dto.password,
    });
    if (error) throw new UnauthorizedException(error.message);

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
}
