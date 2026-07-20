import { IsEmail, IsIn, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class RegisterCustomerDto {
  @IsEmail() email: string;
  @MinLength(8) password: string;
  @IsNotEmpty() fullName: string;
  @IsNotEmpty() phone: string;
}

export class RegisterRiderDto {
  @IsEmail() email: string;
  @MinLength(8) password: string;
  @IsNotEmpty() fullName: string;
  @IsNotEmpty() phone: string;
  @IsIn(['motorcycle', 'bicycle', 'car']) vehicleType: string;
  @IsOptional() plateNumber?: string;
  @IsNotEmpty() licenseNumber: string;
  @IsOptional() licensePhotoUrl?: string;
}

export class LoginDto {
  @IsEmail() email: string;
  @IsNotEmpty() password: string;
}
