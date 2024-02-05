import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { LocalStrategy } from './passport/local.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports:[PassportModule,UsersModule],
  providers: [AuthService,LocalStrategy],

})
export class AuthModule {}
