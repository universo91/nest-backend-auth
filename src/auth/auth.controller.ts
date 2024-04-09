import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginDto, RegisterUserDto, UpdateAuthDto } from './dto';
import { AuthGuard } from './guards/auth.guard';
import { LoginResponse } from './interfaces/login-response';
import { User } from './entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {   
    return this.authService.create(createUserDto);
  }

  @Post('/login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login( loginDto );
  }

  @Post('/register')
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register( registerUserDto );
  }

  @UseGuards( AuthGuard )//Podria enviar mas de un guard
  @Get()
  findAll(@Request() req: Request) {
   /*  const user = req['user']; */
    return this.authService.findAll();
  }

  /** 
   * Metodo para generar un nuevo token(JWT)
   */
  @UseGuards( AuthGuard )
  @Get('check-token')
  checkToken(@Request() request: Request): LoginResponse 
  {
    const user = request['user'] as User;

    return {
      user: user,
      token: this.authService.getJwtToken({ id: user._id })
    };

  }

 /*  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  } */
}
