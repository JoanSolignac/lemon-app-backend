import { Type } from 'class-transformer';
import { IsDate, IsInt, IsOptional, Min } from 'class-validator';

export class SyncQueryDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  readonly page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  readonly limit?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  readonly lastSync?: Date;
}
