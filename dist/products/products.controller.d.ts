import { ProductsService } from './products.service';
export declare class ProductsController {
    private productsService;
    constructor(productsService: ProductsService);
    findAll(category?: string, search?: string): Promise<any[]>;
    categories(): string[];
    findOne(id: string): Promise<any>;
}
