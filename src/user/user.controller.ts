import { Controller, Post } from '@nestjs/common';
import { Body, Delete, Get, Param, Put } from '@nestjs/common/decorators';
import { Observable, map, catchError, of, throwError } from 'rxjs';
import { User } from './model/user-interface';
import { UserService } from './user.service';

@Controller('/api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUser(@Body() user: User): Observable<User | Object> {
    return this.userService.create(user).pipe(
      map((user: User) => user),
      catchError((err) => {
        throw Error(err.message);
      }),
    );
  }

  @Post('/login')
  login(@Body() user: User): Observable<Object> {
    return this.userService.login(user).pipe(
      map((jwt: string) => {
        return { access_token: jwt };
      }),
    );
  }

  @Delete(':id')
  deleteUser(@Param('id') id: number): Observable<User> {
    return this.userService.deleteOne(id);
  }

  @Get()
  findAllUsers(): Observable<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  findOneUser(@Param('id') id: number): Observable<User> {
    return this.userService.findOne(id);
  }

  @Put(':id')
  updateUser(@Param('id') id: number, @Body() user: User): Observable<User> {
    return this.userService.updateOne(id, user);
  }
}
