import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { SupabaseService } from '../config/supabase.service';

/** Per-order chat between the customer and their assigned rider. */
@WebSocketGateway({ cors: { origin: '*' }, namespace: '/chat' })
export class ChatGateway {
  @WebSocketServer() server: Server;

  constructor(private supabase: SupabaseService) {}

  @SubscribeMessage('join:order-chat')
  handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { orderId: string },
  ) {
    client.join(`chat:${data.orderId}`);
  }

  @SubscribeMessage('message:send')
  async handleMessage(
    @MessageBody() data: { orderId: string; senderId: string; message: string },
  ) {
    const client = this.supabase.getClient();
    const { data: saved, error } = await client
    .from('chat_messages')
    .insert({
      order_id: data.orderId,
      sender_id: data.senderId,
      message: data.message,
    })
    .select()
    .single();

  console.log('Saved message:', saved);
  console.log('Chat error:', error);

  if (error) throw error;

    this.server.to(`chat:${data.orderId}`).emit('message:new', saved);
    return saved;
  }
}
