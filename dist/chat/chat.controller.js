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
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../config/supabase.service");
const supabase_auth_guard_1 = require("../auth/supabase-auth.guard");
let ChatController = class ChatController {
    constructor(supabase) {
        this.supabase = supabase;
    }
    async history(orderId) {
        const client = this.supabase.getClient();
        const { data, error } = await client
            .from('chat_messages')
            .select('*')
            .eq('order_id', orderId)
            .order('created_at');
        if (error)
            throw error;
        return data;
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, common_1.Get)(':orderId/history'),
    __param(0, (0, common_1.Param)('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "history", null);
exports.ChatController = ChatController = __decorate([
    (0, common_1.UseGuards)(supabase_auth_guard_1.SupabaseAuthGuard),
    (0, common_1.Controller)('chat'),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], ChatController);
//# sourceMappingURL=chat.controller.js.map