import { Injectable } from '@nestjs/common';
import { UserService } from 'src/users/providers/user.service';

@Injectable()
export class PostsService {
  // Injecting user Service
  constructor(private readonly userService: UserService) {}

  public findAll(userId: string) {
    //Find A User
    const user = this.userService.findOneById(userId);

    return [
      {
        user: user,
        title: 'Test File',
        content: 'Test Content',
      },
      {
        user: user,
        title: 'Test File 2',
        content: 'Test Content 2',
      },
    ];
  }
}
