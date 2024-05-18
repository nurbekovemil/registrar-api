import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsString, Length} from "class-validator";

export class CreateUserDto {
    login: string;
    password: string;
    first_name: string;
    last_name: string;
    company_id: number
}
