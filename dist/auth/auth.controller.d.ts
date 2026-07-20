import { AuthService } from './auth.service';
import { RegisterCustomerDto, RegisterRiderDto, LoginDto } from './dto/register.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    registerCustomer(dto: RegisterCustomerDto): Promise<{
        userId: string;
        message: string;
    }>;
    registerRider(dto: RegisterRiderDto): Promise<{
        userId: string;
        message: string;
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        profile: any;
    }>;
}
