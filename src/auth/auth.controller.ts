import { Controller, Get, Post, Render, UseGuards, Request, Body, Res } from '@nestjs/common';
import { Cookies, Public, ResponseMessage, User } from 'src/decorator/customize';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { IUser } from 'src/users/users.interface';
import { CreateUserDto, RegisterUserDto } from 'src/users/dto/create-user.dto';
import { Response } from 'express';

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) { }

    @Public()
    @UseGuards(LocalAuthGuard)
    @ResponseMessage("User Login")
    @Post('/login')
    async handleLogin(@Request() req: any, @Res({ passthrough: true }) response: Response) {
        const result = await this.authService.login(req.user, response)
        return result
    }

    @Public()
    @Post('/register')
    @ResponseMessage("Register a new user")
    async handleRegister(@Body() registerUserDto: RegisterUserDto) {
        console.log(registerUserDto)
        return this.authService.register(registerUserDto)
    }

    @Get('/account')
    @ResponseMessage("Get user information")
    getAccount(@User() user: IUser) {
        return { user: user }
    }

    @Public()
    @Get('/refresh')
    @ResponseMessage("Refresh token success")
    async handleRefreshToken(@Cookies("refresh_token") refreshToken: string, @Res({ passthrough: true }) response: Response) {
        const result = await this.authService.refreshToken(refreshToken, response)
        return result
    }

    @Post('/logout')
    @ResponseMessage("Logout User")
    async handleLogout(@User() user: IUser, @Res({ passthrough: true }) response: Response) {
        const result = await this.authService.logout(user, response)
        return result
    }

}
