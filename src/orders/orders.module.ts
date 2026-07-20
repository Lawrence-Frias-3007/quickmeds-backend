import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrdersGateway } from './orders.gateway';
import { SupabaseService } from '../config/supabase.service';
import { PrescriptionsModule } from '../prescriptions/prescriptions.module';

@Module({
  imports: [JwtModule.register({}), PrescriptionsModule],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersGateway, SupabaseService],
})
export class OrdersModule {}
