import { Type } from "class-transformer";
import { IsNumber, IsString, IsUUID, ValidateNested } from "class-validator";

class DeviceMetadata {
    @IsString()
    declare readonly name: string;

    @IsString()
    declare readonly platform: string;

    @IsNumber()
    declare readonly version: number;
}

export class CreateDispositivoDto {
    @IsUUID()
    declare readonly deviceId: string

    @ValidateNested()
    @Type(() => DeviceMetadata)
    declare readonly metadata: DeviceMetadata
}