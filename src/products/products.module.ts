import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { SupabaseService } from '../config/supabase.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, SupabaseService],
})
export class ProductsModule {}
