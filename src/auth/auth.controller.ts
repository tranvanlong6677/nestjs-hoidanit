import { Controller, Get, Post, Render, UseGuards, Request } from '@nestjs/common';
import { Public } from 'src/decorator/customize';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) { }

    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async handleLogin(@Request() req) {
        const result = await this.authService.login(req.user)
        return result
    }
   
}
