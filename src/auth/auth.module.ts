import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { LocalStrategy } from './passport/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './passport/jwt.strategy';
import ms from 'ms';

@Module({
  imports: [PassportModule, UsersModule, JwtModule.registerAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      secret: configService.get<string>("JWT_ACCESS_TOKEN"),
      signOptions: { expiresIn: ms(configService.get<string>("JWT_ACCESS_TOKEN_EXPIRES")) },
    }),
    inject: [ConfigService],
  }), AuthModule],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService]

})
export class AuthModule { }
