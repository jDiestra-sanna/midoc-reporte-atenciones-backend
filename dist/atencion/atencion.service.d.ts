import { Repository } from 'typeorm';
import { Atencion } from './atencion.entity';
import { ConfigService } from '@nestjs/config';
export declare class AtencionService {
    private atencionRepo;
    private configService;
    constructor(atencionRepo: Repository<Atencion>, configService: ConfigService);
    getByDate(date: Date): Promise<Atencion[]>;
    getByRange(start: string, end: string): Promise<Atencion[]>;
    sendWeeklyReport(): Promise<void>;
    sendExcelReport(start: string, end: string): Promise<{
        status: string;
    }>;
}
