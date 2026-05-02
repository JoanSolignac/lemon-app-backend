import { IsNumber, Min } from "class-validator";

export class PaginatedQueryDto{
    @IsNumber()
    @Min(1)
    page!: number;

    @IsNumber()
    @Min(1)
    limit!: number;
}