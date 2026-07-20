import { ConfigService } from '@nestjs/config';
import { SupabaseClient } from '@supabase/supabase-js';
/**
 * Wraps a single Supabase client (service-role key) used by the backend
 * for privileged operations: writes that must bypass RLS in a controlled
 * way (e.g. assigning a rider to an order), admin verification of riders,
 * and generating signed URLs for prescription files.
 */
export declare class SupabaseService {
    private config;
    private client;
    constructor(config: ConfigService);
    getClient(): SupabaseClient;
}
