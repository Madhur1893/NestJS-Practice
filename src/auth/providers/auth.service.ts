import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { UserService } from 'src/users/providers/user.service';

@Injectable()
export class AuthService {
  constructor(
    //Injecting user service
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}
  public login(email: string, password: string, id: string) {
    // const user = this.userService.findOneById('1234');
    return 'SAMPLE_TOKEN';
  }
  public isAuth() {
    return true;
  }
}
