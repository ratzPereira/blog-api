import { Controller, Post } from '@nestjs/common';
import { Body, Delete, Get, Param, Put } from '@nestjs/common/decorators';
import { Observable } from 'rxjs';
import { User } from './model/user-interface';
import { UserService } from './user.service';

@Controller('/api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUser(@Body() user: User): Observable<User> {
    return this.userService.create(user);
  }

  @Delete(':id')
  deleteUser(@Param() id: number): Observable<User> {
    return this.userService.deleteOne(id);
  }

  @Get()
  findAllUsers(): Observable<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  findOneUser(@Param() id: number): Observable<User> {
    return this.userService.findOne(id);
  }

  @Put(':id')
  updateUser(@Param() id: number, @Body() user: User): Observable<User> {
    return this.userService.updateOne(id, user);
  }
}
