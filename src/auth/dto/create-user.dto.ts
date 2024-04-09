import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateUserDto {

    @IsEmail() // Estos decoradores se ejecutan, mucho antes que ingresen a los servicios.
    email: string;

    @IsString()
    name: string;

    @MinLength(6)
    password: string;
}
