import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../config/supabase.service';

@Injectable()
export class UsersService {
  constructor(private supabase: SupabaseService) {}

  async getProfile(userId: string) {
    const client = this.supabase.getClient();

    // Get profile
    const { data: profile, error } = await client
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;

    // Get email from Supabase Auth
    const { data: authUser, error: authError } =
      await client.auth.admin.getUserById(userId);

    if (authError) throw authError;

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
  async updateProfile(userId: string, body: { full_name?: string; phone?: string }) {
    const client = this.supabase.getClient();

    const updates: Record<string, string> = {};
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

      if (error) throw error;
    }

    return this.getProfile(userId);
  }

  /** Saves the customer's delivery address with lat/lng captured from the
   * Flutter location picker (required during account setup / first order). */
  async addAddress(userId: string, body: any) {
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

    if (error) throw error;

    return data;
  }

  async listAddresses(userId: string) {
    const client = this.supabase.getClient();
    const { data, error } = await client.from('addresses').select('*').eq('user_id', userId);
    if (error) throw error;
    return data;
  }

  /** Rider toggles availability; only verified riders can go online. */
  async setRiderOnline(riderId: string, online: boolean) {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('rider_profiles')
      .update({ is_online: online })
      .eq('id', riderId)
      .eq('is_verified', true)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async getPreferences(userId: string) {
    const client = this.supabase.getClient();

    const { data, error } = await client
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

    if (error) throw error;

    if (!data) {
      const { data: created, error: insertError } = await client
          .from('user_preferences')
          .insert({
            user_id: userId,
          })
          .select()
          .single();

      if (insertError) throw insertError;

      return created;
    }

    return data;
  }

  async updatePreferences(userId: string, body: any) {
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
}
