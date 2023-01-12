import Resource from './Resource';
import { IsNotEmpty, IsOptional } from '@nestjs/class-validator';

export default class DataPatchRecordResource extends Resource {

    @IsOptional()
    id?: string;

    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    englishName: string;
    @IsNotEmpty()
    seq: number;
    description: string;
    image: Buffer;
    season: string;
    createdBy: string;
    createdDate: Date;
}
