import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/users.interface';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { ConfigService } from '@nestjs/config';
import mongoose from 'mongoose';
import ms from 'ms';
import { Response } from 'express';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService, @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>, private configService: ConfigService) { }
    async validateUser(username: string, pass: string): Promise<any> {
        const user = (await this.usersService.findOneByUsername(username));
        if (user) {
            const isValid = this.usersService.isValidPassword(pass, user.password)
            if (isValid) {
                return user
            }
        }
        return null;
    }
    async login(user: IUser, response: Response) {
        const { _id, name, email, role } = user
        const payload = {
            sub: 'token login', iss: "from server",
            _id, name, email, role
        };

        const refreshToken = this.createRefreshToken(payload)
        await this.usersService.updateUserToken(refreshToken, _id)
        response.cookie('refresh_token', refreshToken, { httpOnly: true, maxAge: ms(this.configService.get<string>("JWT_REFRESH_TOKEN_EXPIRES")) })
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                _id, name, email, role

            }
        };
    }

    async register(registerUserDto: RegisterUserDto) {
        const newId = new mongoose.Types.ObjectId()
        const result = (await this.userModel.create({ ...registerUserDto, _id: newId, role: "USER", password: this.usersService.hashPassword(registerUserDto.password) })).toObject()
        console.log(result)
        return {
            _id: newId,
            createdAt: new Date()
        }
    }

    createRefreshToken = (payload: any) => {
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
            expiresIn: ms(this.configService.get<string>("JWT_REFRESH_TOKEN_EXPIRES")) / 1000
        })
        return refreshToken
    }


    refreshToken = async (refreshToken: string, response: Response) => {
        try {
            this.jwtService.verify(refreshToken, {
                secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET")
            })

            let user = await this.usersService.getUserByToken(refreshToken)
            if (user) {
                console.log("check user", user)
                const { _id, name, email, role } = user
                const payload = {
                    sub: 'token refresh', iss: "from server",
                    _id, name, email, role
                };

                const refreshToken = this.createRefreshToken(payload)
                await this.usersService.updateUserToken(refreshToken, _id.toString())
                response.clearCookie("refresh_token")

                response.cookie('refresh_token', refreshToken, { httpOnly: true, maxAge: ms(this.configService.get<string>("JWT_REFRESH_TOKEN_EXPIRES")) })
                return {
                    access_token: this.jwtService.sign(payload),
                    user: {
                        _id, name, email, role
                    }

                };
            } else {
                throw new BadRequestException("Refresh token không hợp lệ, vui lòng đăng nhập lại!!!")
            }
        } catch (error) {
            throw new BadRequestException("Refresh token không hợp lệ, vui lòng đăng nhập lại!!!")
        }
    }

    logout = async (user: IUser, response: Response) => {
        response.clearCookie("refresh_token")
        await this.userModel.updateOne({ _id: user._id }, { refreshToken: "" })
        return 'logout ok'
    }
}
