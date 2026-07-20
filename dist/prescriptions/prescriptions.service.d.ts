import { SupabaseService } from '../config/supabase.service';
export declare class PrescriptionsService {
    private supabase;
    constructor(supabase: SupabaseService);
    /** Registers metadata for a prescription file already uploaded to the
     * 'prescriptions' storage bucket by the Flutter app (pdf/png/jpg). */
    create(userId: string, fileUrl: string, fileType: string): Promise<any>;
    findByUser(userId: string): Promise<any[]>;
    /** Returns a short-lived signed URL so a pharmacist/rider can view the file
     * without the storage bucket being public. */
    getSignedUrl(path: string): Promise<string>;
    /**
     * Core business rule: if any cart item requires a prescription AND the
     * requested quantity exceeds that product's max_qty_without_prescription,
     * the order must flag requires_prescription_pickup = true so the rider
     * knows they MUST physically collect (borrow) the paper prescription from
     * the customer at pickup/hand-off, not just verify a photo.
     */
    evaluatePickupRequirement(items: {
        requiresPrescription: boolean;
        quantity: number;
        maxQtyWithoutPrescription?: number | null;
    }[]): boolean;
}
