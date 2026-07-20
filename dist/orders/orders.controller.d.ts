import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrdersController {
    private ordersService;
    constructor(ordersService: OrdersService);
    create(req: any, dto: CreateOrderDto): Promise<any>;
    mine(req: any): Promise<any[]>;
    available(): Promise<any[]>;
    riderMine(req: any): Promise<any[]>;
    accept(req: any, id: string): Promise<any>;
    updateStatus(req: any, id: string, body: {
        status: string;
        prescriptionCollected?: boolean;
    }): Promise<any>;
}
