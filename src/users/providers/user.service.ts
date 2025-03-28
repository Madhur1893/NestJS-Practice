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
import { DataSource, Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UsersCreateManyProvider } from './users-create-many.provider';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';

/**
 *  Class to connect to users table and perform buisness operation
 */
@Injectable()
export class UserService {
  constructor(
    // Injecting userRepository
    @InjectRepository(User)
    private userRepository: Repository<User>,

    //Injecting Auth Service
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,

    //Inject usersCreateManyProvider
    private readonly usersCreateManyProvider: UsersCreateManyProvider,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    let existingUser = null as User | null;

    try {
      //Check if user exist with same email

      existingUser = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });
      console.log('existingUser', existingUser);
    } catch (error) {
      //Might save the details of exception
      // Information which is sensitive
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try again',
        { description: 'Error connencting to the database' },
      );
    }

    //Handling exception

    if (existingUser) {
      throw new BadRequestException(
        'The user already exist, please check you email',
      );
    }
    //create a new user
    let newUser = this.userRepository.create(createUserDto);

    try {
      newUser = await this.userRepository.save(newUser);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try again',
        { description: 'Error connencting to the database' },
      );
    }
    return newUser;
  }

  /**
   * The method to get all the users from the database
   */
  public findAll(
    getUsersParamDto: GetUsersParamDto,
    limit: number,
    page: number,
  ) {
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
}
