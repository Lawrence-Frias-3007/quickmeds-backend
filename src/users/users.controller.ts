import { Body, Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';

@UseGuards(SupabaseAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  me(@Req() req: any) {
    return this.usersService.getProfile(req.user.id);
  }

  @Patch('me')
  updateMe(@Req() req: any, @Body() body: { full_name?: string; phone?: string }) {
    return this.usersService.updateProfile(req.user.id, body);
  }

  @Post('addresses')
  addAddress(@Req() req: any, @Body() body: any) {
    return this.usersService.addAddress(req.user.id, body);
  }

  @Get('addresses')
  listAddresses(@Req() req: any) {
    return this.usersService.listAddresses(req.user.id);
  }

  @Get('preferences')
  getPreferences(@Req() req: any) {
    return this.usersService.getPreferences(req.user.id);
  }

  @Patch('preferences')
  updatePreferences(@Req() req: any, @Body() body: any) {
    return this.usersService.updatePreferences(req.user.id, body);
  }

  @Patch('rider/online')
  setOnline(@Req() req: any, @Body() body: { online: boolean }) {
    return this.usersService.setRiderOnline(req.user.id, body.online);
  }
}
