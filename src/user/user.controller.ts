import { Controller, Post, Query } from '@nestjs/common';
import {
  Body,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common/decorators';
import { Pagination } from 'nestjs-typeorm-paginate';
import { catchError, map, Observable } from 'rxjs';
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
    console.log(user.username, user.password);
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
  index(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('username') username: string,
  ): Observable<Pagination<User>> {
    limit = limit > 100 ? 100 : limit;

    if (username === null || username === undefined) {
      return this.userService.paginate({
        page: Number(page),
        limit: Number(limit),
        route: 'http://localhost:3000/api/users',
      });
    } else {
      return this.userService.paginateFilterByUsername(
        {
          page: Number(page),
          limit: Number(limit),
          route: 'http://localhost:3000/api/users',
        },
        { username },
      );
    }
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
  updateRoleOfUser(
    @Param('id') id: number,
    @Body() user: User,
  ): Observable<User> {
    return this.userService.updateRoleOfUser(Number(id), user);
  }
}
