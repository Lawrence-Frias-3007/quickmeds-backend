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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const supabase_service_1 = require("../config/supabase.service");
/**
 * Live tracking channel. The rider app emits 'rider:location' every few
 * seconds while an order is active; we persist it and broadcast it to the
 * room named after the order so the customer's map marker updates in
 * real time (this mirrors what the customer sees on the order-tracking
 * screen: "shows the location of the rider").
 */
let OrdersGateway = class OrdersGateway {
    constructor(supabase) {
        this.supabase = supabase;
    }
    handleJoin(client, data) {
        client.join(`order:${data.orderId}`);
    }
    async handleRiderLocation(data) {
        const client = this.supabase.getClient();
        const result = await client.from('rider_locations').insert({
            rider_id: data.riderId,
            latitude: data.lat,
            longitude: data.lng,
            heading: data.heading,
        });
        console.log(result);
        await client
            .from('rider_profiles')
            .update({ current_lat: data.lat, current_lng: data.lng, last_location_update: new Date().toISOString() })
            .eq('id', data.riderId);
        this.server.to(`order:${data.orderId}`).emit('rider:location:update', data);
    }
    handleStatus(data) {
        this.server.to(`order:${data.orderId}`).emit('order:status:update', data);
    }
};
exports.OrdersGateway = OrdersGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], OrdersGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join:order'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], OrdersGateway.prototype, "handleJoin", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('rider:location'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersGateway.prototype, "handleRiderLocation", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('order:status'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OrdersGateway.prototype, "handleStatus", null);
exports.OrdersGateway = OrdersGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: { origin: '*' }, namespace: '/tracking' }),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], OrdersGateway);
//# sourceMappingURL=orders.gateway.js.map