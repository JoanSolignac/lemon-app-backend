import { Transform } from "class-transformer";
import { IsEmail, IsString, Length } from "class-validator";

export class LoginDto {
    @IsString()
    @IsEmail()
    @Transform(({ value }) => typeof value === "string" ? value.toLocaleLowerCase() : value)
    readonly correoElectronico!: string;

    @IsString()
    @Length(2, 255)
    readonly contrasena!: string;
}