import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccessTokenGuard } from '../access-token/access-token.guard';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { AUTH_TYPE_KEY } from 'src/auth/constants/auth.constants';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private static readonly defaultAuthType = AuthType.Bearer;
  private get authTypeGuardMap(): Record<
    AuthType,
    CanActivate | CanActivate[]
  > {
    return {
      [AuthType.Bearer]: this.accessTokenGuard,
      [AuthType.None]: { canActivate: () => true },
    };
  }

  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // console.log(this.authTypeGuardMap);

    // authTypes from reflector
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const authTypes: AuthType[] = this.reflector.getAllAndOverride(
      AUTH_TYPE_KEY,
      [context.getHandler(), context.getClass()],
    ) ?? [AuthenticationGuard.defaultAuthType];

    // array of guards
    const guards = authTypes.map((type) => this.authTypeGuardMap[type]).flat();

    // Default error
    const error = new UnauthorizedException();

    // loop guards canActivate
    for (const instance of guards) {
      const canActivate = await Promise.resolve(
        instance.canActivate(context),
      ).catch((err) => {
        error: err;
      });

      if (canActivate) {
        return true;
      }
    }
    throw error;
  }
}
