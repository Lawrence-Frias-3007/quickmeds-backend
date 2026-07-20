import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrescriptionsController } from './prescriptions.controller';
import { PrescriptionsService } from './prescriptions.service';
import { SupabaseService } from '../config/supabase.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [PrescriptionsController],
  providers: [PrescriptionsService, SupabaseService],
  exports: [PrescriptionsService],
})
export class PrescriptionsModule {}
