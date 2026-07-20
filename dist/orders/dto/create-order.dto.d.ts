declare class OrderItemDto {
    productId: string;
    quantity: number;
}
export declare class CreateOrderDto {
    items: OrderItemDto[];
    deliveryAddressLine: string;
    deliveryLat: number;
    deliveryLng: number;
    paymentMethod: string;
    prescriptionId?: string;
    notes?: string;
}
export {};
