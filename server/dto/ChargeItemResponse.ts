import { IsArray, IsNotEmpty, IsString, ValidateNested } from '@nestjs/class-validator';
import { Type } from 'class-transformer';

export class ChargeItemResponse {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChargeItemRecord)
  records: ChargeItemRecord[];
}

export class ChargeItemRecord {
  @IsString()
  @IsNotEmpty()
  timestamp: string;

  @IsString()
  keys: string;
}