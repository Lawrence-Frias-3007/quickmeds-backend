import { IsArray, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsString() productId: string;
  @IsNumber() quantity: number;
}

export class CreateOrderDto {
  @IsArray() @ValidateNested({ each: true }) @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsString() deliveryAddressLine: string;
  @IsNumber() deliveryLat: number;
  @IsNumber() deliveryLng: number;

  @IsIn(['cash_on_delivery', 'online']) paymentMethod: string;

  @IsOptional() @IsString() prescriptionId?: string;
  @IsOptional() @IsString() notes?: string;
}
