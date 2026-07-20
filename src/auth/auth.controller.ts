import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterCustomerDto, RegisterRiderDto, LoginDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register/customer')
  registerCustomer(@Body() dto: RegisterCustomerDto) {
    return this.authService.registerCustomer(dto);
  }

  @Post('register/rider')
  registerRider(@Body() dto: RegisterRiderDto) {
    return this.authService.registerRider(dto);
  }

  // Single login endpoint for both roles; the returned profile.role tells
  // the Flutter app which UI (customer or rider) to route into.
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
