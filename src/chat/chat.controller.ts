import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { SupabaseService } from '../config/supabase.service';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';

@UseGuards(SupabaseAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private supabase: SupabaseService) {}

  @Get(':orderId/history')
  async history(@Param('orderId') orderId: string) {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('chat_messages')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at');
    if (error) throw error;
    return data;
  }
}
