import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  Body,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUsersParamDto } from './dtos/get-users-param.dto';
import { PatchUsersDto } from './dtos/patch-users.dto';
import { UserService } from './providers/user.service';
import {
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateManyUsersDto } from './dtos/create-many-users.dto';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(
    //Injecting Users Service
    private readonly userService: UserService,
  ) {}

  @Get('{/:id}')
  @ApiOperation({
    summary: 'Fetches a list of register user of the application',
  })
  @ApiResponse({
    status: 200,
  })
  @ApiQuery({
    name: 'limit',
    type: 'number',
    required: false,
    description: 'The number of entries returned per query',
    example: 10,
  })
  @ApiParam({
    name: 'page',
    type: 'number',
    required: false,
    description:
      'The position of the page number that you want the API to return',
    example: 1,
  })
  public getUsers(
    @Param() getUsersParamDto: GetUsersParamDto,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return this.userService.findAll(getUsersParamDto, limit, page);
  }

  @Post()
  public createUsers(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }
  @Post('create-many')
  public createManyUsers(@Body() createManyUsersDto: CreateManyUsersDto) {
    return this.userService.createMany(createManyUsersDto);
  }

  @Patch()
  public patchUsers(@Body() patchUserDto: PatchUsersDto) {
    console.log(patchUserDto);
    return 'You sent a pacth request to users endpoints';
  }
}
