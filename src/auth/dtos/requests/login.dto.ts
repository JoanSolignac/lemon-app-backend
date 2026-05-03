import { Transform } from "class-transformer";
import { IsEmail, IsString, Length } from "class-validator";

export class LoginDto {
    @IsString()
    @IsEmail()
    @Transform(({ value }) => typeof value === "string" ? value.toLowerCase() : value)
    declare readonly correoElectronico: string;

    @IsString()
    @Length(2, 255)
    declare readonly contrasena: string;
}