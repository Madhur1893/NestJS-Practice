import {
  ConflictException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { User } from '../user.entity';
import { DataSource } from 'typeorm';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';

@Injectable()
export class UsersCreateManyProvider {
  constructor(
    //Inject Datasource
    private readonly datasource: DataSource,
  ) {}

  public async createMany(createManyUserDto: CreateManyUsersDto) {
    const newUsers: User[] = [];
    // Create Query Runner Instance
    const queryRunner = this.datasource.createQueryRunner();
    try {
      // Connect Query Runner to database
      await queryRunner.connect();
      // Start Transaction
      await queryRunner.startTransaction();
    } catch (error) {
      throw new RequestTimeoutException('Could not connect to the database');
    }

    try {
      for (const user of createManyUserDto.users) {
        const newUser = queryRunner.manager.create(User, user);
        const result = await queryRunner.manager.save(newUser);
        newUsers.push(result);
      }
      // If successfull commit
      await queryRunner.commitTransaction();
    } catch (error) {
      // If unsuccessfull rollback
      await queryRunner.rollbackTransaction();
      throw new ConflictException('Could not complete the transaction', {
        description: String(error),
      });
    } finally {
      // Release connection
      await queryRunner.release();
    }
    return newUsers;
  }
}
