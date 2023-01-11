import Resource from '../Resource';
import { IsNotEmpty, IsOptional } from '@nestjs/class-validator';

export default class SessionResource extends Resource {

    @IsOptional()
    sid?: string;

    @IsNotEmpty()
    cookie: object;

    @IsOptional()
    passport: object;
}
 