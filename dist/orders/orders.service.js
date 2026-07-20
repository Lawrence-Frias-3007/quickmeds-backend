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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../config/supabase.service");
const prescriptions_service_1 = require("../prescriptions/prescriptions.service");
const DELIVERY_FEE = 49.0;
let OrdersService = class OrdersService {
    constructor(supabase, prescriptionsService) {
        this.supabase = supabase;
        this.prescriptionsService = prescriptionsService;
    }
    /** Checkout: validates stock/Rx rules, snapshots line items, creates the order. */
    async create(customerId, dto) {
        const client = this.supabase.getClient();
        const productIds = dto.items.map((i) => i.productId);
        const { data: products, error: prodErr } = await client
            .from('products')
            .select('*')
            .in('id', productIds);
        if (prodErr)
            throw prodErr;
        if (!products || products.length !== productIds.length) {
            throw new common_1.BadRequestException('One or more products are unavailable.');
        }
        let subtotal = 0;
        const lineItems = dto.items.map((item) => {
            const product = products.find((p) => p.id === item.productId);
            if (product.stock_qty < item.quantity) {
                throw new common_1.BadRequestException(`${product.name} does not have enough stock.`);
            }
            subtotal += Number(product.price) * item.quantity;
            return {
                product_id: product.id,
                product_name: product.name,
                quantity: item.quantity,
                unit_price: product.price,
                requires_prescription: product.requires_prescription,
                max_qty_without_prescription: product.max_qty_without_prescription,
            };
        });
        const requiresPickup = this.prescriptionsService.evaluatePickupRequirement(lineItems.map((li) => ({
            requiresPrescription: li.requires_prescription,
            quantity: li.quantity,
            maxQtyWithoutPrescription: li.max_qty_without_prescription,
        })));
        if (requiresPickup && !dto.prescriptionId) {
            throw new common_1.BadRequestException('This order requires a prescription. Please attach a photo/PDF of your prescription before checking out — the rider will collect the physical copy on pickup.');
        }
        const total = subtotal + DELIVERY_FEE;
        const orderNumber = `QM-${Date.now().toString(36).toUpperCase()}`;
        const { data: order, error: orderErr } = await client
            .from('orders')
            .insert({
            order_number: orderNumber,
            customer_id: customerId,
            prescription_id: dto.prescriptionId ?? null,
            requires_prescription_pickup: requiresPickup,
            delivery_address_line: dto.deliveryAddressLine,
            delivery_lat: dto.deliveryLat,
            delivery_lng: dto.deliveryLng,
            subtotal,
            delivery_fee: DELIVERY_FEE,
            total,
            payment_method: dto.paymentMethod,
            notes: dto.notes,
        })
            .select()
            .single();
        if (orderErr)
            throw orderErr;
        const { error: itemsErr } = await client.from('order_items').insert(lineItems.map((li) => ({
            order_id: order.id,
            product_id: li.product_id,
            product_name: li.product_name,
            quantity: li.quantity,
            unit_price: li.unit_price,
            requires_prescription: li.requires_prescription,
        })));
        if (itemsErr) {
            await client.from('orders').delete().eq('id', order.id);
            throw itemsErr;
        }
        return order;
    }
    async findForCustomer(customerId) {
        const client = this.supabase.getClient();
        const { data, error } = await client
            .from('orders')
            .select('*, order_items(*)')
            .eq('customer_id', customerId)
            .order('created_at', { ascending: false });
        if (error)
            throw error;
        return data;
    }
    /** Orders visible to riders looking for work: pending, unassigned. */
    async findAvailableForRiders() {
        const client = this.supabase.getClient();
        const { data, error } = await client
            .from('orders')
            .select('*, order_items(*)')
            .eq('status', 'pending')
            .is('rider_id', null)
            .order('created_at');
        if (error)
            throw error;
        return data;
    }
    async findForRider(riderId) {
        const client = this.supabase.getClient();
        const { data, error } = await client
            .from('orders')
            .select('*, order_items(*)')
            .eq('rider_id', riderId)
            .order('created_at', { ascending: false });
        if (error)
            throw error;
        return data;
    }
    async acceptOrder(riderId, orderId) {
        const client = this.supabase.getClient();
        const { data: existing } = await client.from('orders').select('rider_id, status').eq('id', orderId).single();
        if (!existing)
            throw new common_1.NotFoundException('Order not found');
        if (existing.rider_id)
            throw new common_1.BadRequestException('Order already taken by another rider.');
        const { data, error } = await client
            .from('orders')
            .update({ rider_id: riderId, status: 'accepted', accepted_at: new Date().toISOString() })
            .eq('id', orderId)
            .select()
            .single();
        if (error)
            throw error;
        return data;
    }
    /**
     * Status transitions the rider drives from the delivery app:
     * accepted -> rider_to_pharmacy -> picked_up -> on_the_way -> delivered.
     * When requires_prescription_pickup is true, 'picked_up' is only reachable
     * after the rider confirms physical collection of the paper Rx (enforced
     * client-side with a confirmation step, and logged here via notes).
     */
    async updateStatus(riderId, orderId, status, prescriptionCollected) {
        const client = this.supabase.getClient();
        const { data: order, error: fetchErr } = await client.from('orders').select('*').eq('id', orderId).single();
        if (fetchErr || !order)
            throw new common_1.NotFoundException('Order not found');
        if (order.rider_id !== riderId)
            throw new common_1.BadRequestException('Not your order.');
        if (status === 'picked_up' && order.requires_prescription_pickup && !prescriptionCollected) {
            throw new common_1.BadRequestException('This order requires the physical prescription. Confirm you have collected it from the customer before marking as picked up.');
        }
        const timestampField = status === 'picked_up' ? { picked_up_at: new Date().toISOString() } :
            status === 'delivered' ? { delivered_at: new Date().toISOString() } : {};
        const { data, error } = await client
            .from('orders')
            .update({ status, ...timestampField })
            .eq('id', orderId)
            .select()
            .single();
        if (error)
            throw error;
        if (status === 'delivered') {
            await client.rpc('increment_rider_deliveries', { rider_id_input: riderId }).select();
        }
        return data;
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService,
        prescriptions_service_1.PrescriptionsService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map