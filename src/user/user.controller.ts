import { Controller, Post } from '@nestjs/common';
import { Body, Delete, Get, Param, Put, UseGuards } from '@nestjs/common/decorators';
import { Observable, map, catchError, of, throwError } from 'rxjs';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { User, UserRole } from './model/user-interface';
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
  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
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


  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id/role')
  updateRoleOfUser(@Param('id') id: number, @Body() user: User): Observable<User>{
    
    return this.userService.updateRoleOfUser(Number(id), user);
  }
}
