export declare class RegisterCustomerDto {
    email: string;
    password: string;
    fullName: string;
    phone: string;
}
export declare class RegisterRiderDto {
    email: string;
    password: string;
    fullName: string;
    phone: string;
    vehicleType: string;
    plateNumber?: string;
    licenseNumber: string;
    licensePhotoUrl?: string;
}
export declare class LoginDto {
    email: string;
    password: string;
}
