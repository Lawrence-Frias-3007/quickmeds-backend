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
exports.PrescriptionsService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../config/supabase.service");
let PrescriptionsService = class PrescriptionsService {
    constructor(supabase) {
        this.supabase = supabase;
    }
    /** Registers metadata for a prescription file already uploaded to the
     * 'prescriptions' storage bucket by the Flutter app (pdf/png/jpg). */
    async create(userId, fileUrl, fileType) {
        const client = this.supabase.getClient();
        const { data, error } = await client
            .from('prescriptions')
            .insert({ user_id: userId, file_url: fileUrl, file_type: fileType })
            .select()
            .single();
        if (error)
            throw error;
        return data;
    }
    async findByUser(userId) {
        const client = this.supabase.getClient();
        const { data, error } = await client
            .from('prescriptions')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        if (error)
            throw error;
        return data;
    }
    /** Returns a short-lived signed URL so a pharmacist/rider can view the file
     * without the storage bucket being public. */
    async getSignedUrl(path) {
        const client = this.supabase.getClient();
        const { data, error } = await client.storage
            .from('prescriptions')
            .createSignedUrl(path, 60 * 10); // 10 minutes
        if (error)
            throw error;
        return data.signedUrl;
    }
    /**
     * Core business rule: if any cart item requires a prescription AND the
     * requested quantity exceeds that product's max_qty_without_prescription,
     * the order must flag requires_prescription_pickup = true so the rider
     * knows they MUST physically collect (borrow) the paper prescription from
     * the customer at pickup/hand-off, not just verify a photo.
     */
    evaluatePickupRequirement(items) {
        return items.some((item) => {
            if (!item.requiresPrescription)
                return false;
            if (item.maxQtyWithoutPrescription == null)
                return true; // always needs Rx
            return item.quantity > item.maxQtyWithoutPrescription;
        });
    }
};
exports.PrescriptionsService = PrescriptionsService;
exports.PrescriptionsService = PrescriptionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], PrescriptionsService);
//# sourceMappingURL=prescriptions.service.js.map