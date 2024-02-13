import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNotEmptyObject, IsObject, ValidateNested } from "class-validator";
import mongoose from "mongoose";

class Company {
    @IsNotEmpty()
    _id: mongoose.Schema.Types.ObjectId

    @IsNotEmpty()
    name: string
}
export class RegisterUserDto {
    @IsNotEmpty({ message: "Password khong duoc de trong" })
    name: string;

    @IsEmail({}, { message: "Email phai dung dinh dang" })
    @IsNotEmpty({ message: "Email khong duoc de trong" })
    email: string;

    @IsNotEmpty({ message: "Password khong duoc de trong" })
    password: string;

    @IsNotEmpty({ message: "Password khong duoc de trong" })
    age: number

    @IsNotEmpty({ message: "Password khong duoc de trong" })
    address: string;

    @IsNotEmpty({ message: "Password khong duoc de trong" })
    gender: string

    @IsNotEmpty({ message: "Password khong duoc de trong" })
    role: string

}
export class CreateUserDto {
    @IsNotEmpty({ message: "Password khong duoc de trong" })
    name: string;

    @IsEmail({}, { message: "Email phai dung dinh dang" })
    @IsNotEmpty({ message: "Email khong duoc de trong" })
    email: string;

    @IsNotEmpty({ message: "Password khong duoc de trong" })
    password: string;

    @IsNotEmpty({ message: "Password khong duoc de trong" })
    age: number

    @IsNotEmpty({ message: "Password khong duoc de trong" })
    address: string;

    @IsNotEmpty({ message: "Password khong duoc de trong" })
    gender: string

    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    company: Company
}
