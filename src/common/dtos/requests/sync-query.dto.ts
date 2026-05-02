import { Type } from "class-transformer";
import { IsDate } from "class-validator";

export class SyncQueryDto {
    @Type(() => Date)
    @IsDate()
    readonly lastSync!: Date;
}