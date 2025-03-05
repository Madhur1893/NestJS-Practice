import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  ParseIntPipe,
  Headers,
  Ip,
} from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get('/:id/{:optional}')
  public getUsers(
    @Param('id', ParseIntPipe) id: number | undefined,
    @Param('optional') optional: number,
    @Query('limit', ParseIntPipe) limit?: number,
  ) {
    console.log(id);
    console.log(limit);
    console.log(optional);
    if (optional) {
      return `ID is ${id} and optional parameter is ${optional}`;
    } else {
      return `ID is ${id} and no optional parameter`;
    }
  }

  @Post()
  public createUsers(
    @Body('email') email: any,
    @Headers() headers: any,
    @Ip() Ip: any,
  ) {
    console.log(email);
    console.log(headers);
    console.log(Ip);
    return 'You sent a post reques to users endpoints';
  }
}
