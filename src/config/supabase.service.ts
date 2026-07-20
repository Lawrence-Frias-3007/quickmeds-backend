import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Wraps a single Supabase client (service-role key) used by the backend
 * for privileged operations: writes that must bypass RLS in a controlled
 * way (e.g. assigning a rider to an order), admin verification of riders,
 * and generating signed URLs for prescription files.
 */
@Injectable()
export class SupabaseService {
  private client: SupabaseClient;

  constructor(private config: ConfigService) {
  console.log('SUPABASE URL:', this.config.get('SUPABASE_URL'));
  console.log(
    'SERVICE ROLE KEY:',
    this.config.get<string>('SUPABASE_SERVICE_ROLE_KEY')?.substring(0, 30),
  );

  this.client = createClient(
    this.config.get<string>('SUPABASE_URL')!,
    this.config.get<string>('SUPABASE_SERVICE_ROLE_KEY')!,
    { auth: { persistSession: false } },
  );
}

  getClient(): SupabaseClient {
    return this.client;
  }
}
