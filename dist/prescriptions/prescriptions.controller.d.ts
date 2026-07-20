import { PrescriptionsService } from './prescriptions.service';
export declare class PrescriptionsController {
    private prescriptionsService;
    constructor(prescriptionsService: PrescriptionsService);
    create(req: any, body: {
        fileUrl: string;
        fileType: string;
    }): Promise<any>;
    mine(req: any): Promise<any[]>;
    signedUrl(path: string): Promise<string>;
}
