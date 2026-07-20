import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { PrescriptionsService } from './prescriptions.service';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';

@UseGuards(SupabaseAuthGuard)
@Controller('prescriptions')
export class PrescriptionsController {
  constructor(private prescriptionsService: PrescriptionsService) {}

  @Post()
  create(@Req() req: any, @Body() body: { fileUrl: string; fileType: string }) {
    return this.prescriptionsService.create(req.user.id, body.fileUrl, body.fileType);
  }

  @Get('mine')
  mine(@Req() req: any) {
    return this.prescriptionsService.findByUser(req.user.id);
  }

  @Get('signed-url/:path')
  signedUrl(@Param('path') path: string) {
    return this.prescriptionsService.getSignedUrl(path);
  }
}
