import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import {
  IS_PUBLIC_KEY,
  IS_PUBLIC_PERMISSION,
} from 'src/decorator/customize';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext) {
    const isPublic =
      this.reflector.getAllAndOverride<boolean>(
        IS_PUBLIC_KEY,
        [context.getHandler(), context.getClass()],
      );
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest(
    err,
    user,
    info,
    context: ExecutionContext,
  ) {
    const isSkipPermission =
      this.reflector.getAllAndOverride<boolean>(
        IS_PUBLIC_PERMISSION,
        [context.getHandler(), context.getClass()],
      );
    const request: Request = context
      .switchToHttp()
      .getRequest();
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw (
        err || new UnauthorizedException('Invalid Token!')
      );
    }

    // check permissions
    const targetMethod = request.method;
    const targetEndpoint = request.route?.path;

    const permissions = user?.permissions ?? [];
    let isExist = permissions.find(
      (permission) =>
        targetMethod === permission.method &&
        targetEndpoint === permission.apiPath,
    );
    if (targetEndpoint.startsWith('/api/v1/auth')) {
      isExist = true;
    }
    if (!isExist && !isSkipPermission) {
      throw new ForbiddenException(
        'Bạn không có quyền truy cập api này',
      );
    }

    return user;
  }
}
