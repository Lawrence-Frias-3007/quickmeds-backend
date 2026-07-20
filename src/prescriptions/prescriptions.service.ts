import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../config/supabase.service';

@Injectable()
export class PrescriptionsService {
  constructor(private supabase: SupabaseService) {}

  /** Registers metadata for a prescription file already uploaded to the
   * 'prescriptions' storage bucket by the Flutter app (pdf/png/jpg). */
  async create(userId: string, fileUrl: string, fileType: string) {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('prescriptions')
      .insert({ user_id: userId, file_url: fileUrl, file_type: fileType })
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async findByUser(userId: string) {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('prescriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  /** Returns a short-lived signed URL so a pharmacist/rider can view the file
   * without the storage bucket being public. */
  async getSignedUrl(path: string) {
    const client = this.supabase.getClient();
    const { data, error } = await client.storage
      .from('prescriptions')
      .createSignedUrl(path, 60 * 10); // 10 minutes
    if (error) throw error;
    return data.signedUrl;
  }

  /**
   * Core business rule: if any cart item requires a prescription AND the
   * requested quantity exceeds that product's max_qty_without_prescription,
   * the order must flag requires_prescription_pickup = true so the rider
   * knows they MUST physically collect (borrow) the paper prescription from
   * the customer at pickup/hand-off, not just verify a photo.
   */
  evaluatePickupRequirement(
    items: { requiresPrescription: boolean; quantity: number; maxQtyWithoutPrescription?: number | null }[],
  ): boolean {
    return items.some((item) => {
      if (!item.requiresPrescription) return false;
      if (item.maxQtyWithoutPrescription == null) return true; // always needs Rx
      return item.quantity > item.maxQtyWithoutPrescription;
    });
  }
}
