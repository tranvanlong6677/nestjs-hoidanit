import { Controller, Get, Post, Render, UseGuards,Request } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private configService: ConfigService,private authService:AuthService) { }
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async handleLogin(@Request() req){
    const result = await this.authService.login(req.user)
    return result
  }
}
