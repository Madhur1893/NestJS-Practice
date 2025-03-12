import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  Body,
  ParseIntPipe,
  Headers,
  Ip,
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
  public createUsers(
    @Body() createUserDto: CreateUserDto,
    @Headers() headers: any,
    @Ip() Ip: any,
  ) {
    console.log(createUserDto instanceof CreateUserDto);
    console.log(headers);
    console.log(Ip);
    return 'You sent a post request to users endpoints';
  }

  @Patch()
  public patchUsers(@Body() patchUserDto: PatchUsersDto) {
    console.log(patchUserDto);
    return 'You sent a pacth request to users endpoints';
  }
}
