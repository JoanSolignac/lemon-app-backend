import { IsInt } from "class-validator";

export class DeleteClienteDto {
    @IsInt()
    readonly version!: number;
}