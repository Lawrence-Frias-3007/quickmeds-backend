import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../config/supabase.service';

@Injectable()
export class ProductsService {
  constructor(private supabase: SupabaseService) {}

  /** Search + category filter, mirroring a Foodpanda-style browse/search bar. */
  async findAll(params: { category?: string; search?: string }) {
    const client = this.supabase.getClient();
    let query = client.from('products').select('*').eq('is_active', true);

    if (params.category) {
      query = query.eq('category', params.category);
    }
    if (params.search) {
      query = query.ilike('name', `%${params.search}%`);
    }
    const { data, error } = await query.order('name');
    if (error) throw error;
    return data;
  }

  async findOne(id: string) {
    const client = this.supabase.getClient();
    const { data, error } = await client.from('products').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  }

  /** Categories drive the filter chips: vitamins, supplements, OTC, etc. */
  listCategories() {
    return [
      'prescription',
      'otc_medicine',
      'vitamins',
      'supplements',
      'personal_care',
      'medical_devices',
      'baby_and_maternal',
      'first_aid',
    ];
  }
}
