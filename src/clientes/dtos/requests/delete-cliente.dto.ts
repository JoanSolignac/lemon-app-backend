import { IsInt } from "class-validator";

export class DeleteClienteDto {
    @IsInt()
    declare readonly version: number;
}