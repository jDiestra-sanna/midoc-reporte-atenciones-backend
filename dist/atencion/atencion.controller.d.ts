import { AtencionService } from './atencion.service';
export declare class AtencionController {
    private service;
    constructor(service: AtencionService);
    get(date?: string, start?: string, end?: string): Promise<import("./atencion.entity").Atencion[]>;
    enviarReporte(body: {
        start: string;
        end: string;
    }): Promise<{
        status: string;
    }>;
}
