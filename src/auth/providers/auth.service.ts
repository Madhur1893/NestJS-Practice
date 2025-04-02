import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { UserService } from 'src/users/providers/user.service';
import { SignInDto } from '../dtos/signin.dto';
import { SignInProvider } from './sign-in.provider';

@Injectable()
export class AuthService {
  constructor(
    //Injecting user service
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,

    // Injecting signInProvider
    private readonly signInProvider: SignInProvider,
  ) {}
  public async signIn(signInDto: SignInDto) {
    return await this.signInProvider.signIn(signInDto);
  }
  public isAuth() {
    return true;
  }
}
