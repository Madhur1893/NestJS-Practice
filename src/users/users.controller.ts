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

@Controller('users')
export class UsersController {
  @Get('{/:id}')
  public getUsers(
    @Param() getUsersParamDto: GetUsersParamDto,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    console.log(typeof getUsersParamDto);
    console.log(typeof limit);
    console.log(typeof page);
    console.log(getUsersParamDto);
    console.log(limit);
    console.log(page);
    return `You sent a get request to user endpoint`;
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
