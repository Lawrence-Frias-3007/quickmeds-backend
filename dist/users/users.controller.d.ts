import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    me(req: any): Promise<any>;
    updateMe(req: any, body: {
        full_name?: string;
        phone?: string;
    }): Promise<any>;
    addAddress(req: any, body: any): Promise<any>;
    listAddresses(req: any): Promise<any[]>;
    getPreferences(req: any): Promise<any>;
    updatePreferences(req: any, body: any): Promise<any>;
    setOnline(req: any, body: {
        online: boolean;
    }): Promise<any>;
}
