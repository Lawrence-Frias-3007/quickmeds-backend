import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { SupabaseService } from '../config/supabase.service';

/**
 * Live tracking channel. The rider app emits 'rider:location' every few
 * seconds while an order is active; we persist it and broadcast it to the
 * room named after the order so the customer's map marker updates in
 * real time (this mirrors what the customer sees on the order-tracking
 * screen: "shows the location of the rider").
 */
@WebSocketGateway({ cors: { origin: '*' }, namespace: '/tracking' })
export class OrdersGateway {
  @WebSocketServer() server: Server;

  constructor(private supabase: SupabaseService) {}

  @SubscribeMessage('join:order')
  handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { orderId: string },
  ) {
    client.join(`order:${data.orderId}`);
  }

  @SubscribeMessage('rider:location')
  async handleRiderLocation(
    @MessageBody() data: { orderId: string; riderId: string; lat: number; lng: number; heading?: number },
  ) {
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

  @SubscribeMessage('order:status')
  handleStatus(@MessageBody() data: { orderId: string; status: string }) {
    this.server.to(`order:${data.orderId}`).emit('order:status:update', data);
  }
}
