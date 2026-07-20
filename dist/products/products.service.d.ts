import { SupabaseService } from '../config/supabase.service';
export declare class ProductsService {
    private supabase;
    constructor(supabase: SupabaseService);
    /** Search + category filter, mirroring a Foodpanda-style browse/search bar. */
    findAll(params: {
        category?: string;
        search?: string;
    }): Promise<any[]>;
    findOne(id: string): Promise<any>;
    /** Categories drive the filter chips: vitamins, supplements, OTC, etc. */
    listCategories(): string[];
}
