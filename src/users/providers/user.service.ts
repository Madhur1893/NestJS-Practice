import {
  BadRequestException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-users-param.dto';
import { AuthService } from 'src/auth/providers/auth.service';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { UsersCreateManyProvider } from './users-create-many.provider';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';
import { CreateUserProvider } from './create-user.provider';
import { FindOneUserByEmailProvider } from './find-one-user-by-email.provider';

/**
 *  Class to connect to users table and perform buisness operation
 */
@Injectable()
export class UserService {
  constructor(
    // Injecting userRepository
    @InjectRepository(User)
    private userRepository: Repository<User>,

    //Injecting ConfigService
    private readonly configService: ConfigService,

    //Injecting Auth Service
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,

    //Inject usersCreateManyProvider
    private readonly usersCreateManyProvider: UsersCreateManyProvider,

    //Inject createUserProvider
    private readonly createUserProvider: CreateUserProvider,

    //Injecting findOneByEmailProvider
    private readonly findOneByEmailProvider: FindOneUserByEmailProvider,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    return this.createUserProvider.createUser(createUserDto);
  }

  /**
   * The method to get all the users from the database
   */
  public findAll(
    getUsersParamDto: GetUsersParamDto,
    limit: number,
    page: number,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const environment = this.configService.get('S3_BUCKET');
    console.log(environment);
    throw new HttpException(
      { error: 'The API does not exist' },
      HttpStatus.MOVED_PERMANENTLY,
      {
        description: 'Occured because the API endpoint permanently moved',
      },
    );
  }

  /**
   * Find a single user using the ID of the user
   */
  public async findOneById(id: number) {
    let user = null as User | null;
    try {
      user = await this.userRepository.findOneBy({ id });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try again',
        { description: 'Error connencting to the database' },
      );
    }
    // Handle the user does not exist
    if (!user) {
      throw new BadRequestException('The user id does not exist');
    }
    return user;
  }

  public async createMany(createManyUsersDto: CreateManyUsersDto) {
    return await this.usersCreateManyProvider.createMany(createManyUsersDto);
  }

  public async findOneByEmail(email: string) {
    return await this.findOneByEmailProvider.findOneByEmail(email);
  }
}
