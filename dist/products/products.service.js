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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../config/supabase.service");
let ProductsService = class ProductsService {
    constructor(supabase) {
        this.supabase = supabase;
    }
    /** Search + category filter, mirroring a Foodpanda-style browse/search bar. */
    async findAll(params) {
        const client = this.supabase.getClient();
        let query = client.from('products').select('*').eq('is_active', true);
        if (params.category) {
            query = query.eq('category', params.category);
        }
        if (params.search) {
            query = query.ilike('name', `%${params.search}%`);
        }
        const { data, error } = await query.order('name');
        if (error)
            throw error;
        return data;
    }
    async findOne(id) {
        const client = this.supabase.getClient();
        const { data, error } = await client.from('products').select('*').eq('id', id).single();
        if (error)
            throw error;
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
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], ProductsService);
//# sourceMappingURL=products.service.js.map