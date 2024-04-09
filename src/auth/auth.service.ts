import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload';
import { LoginResponse } from './interfaces/login-response';
import { RegisterUserDto, CreateUserDto, UpdateAuthDto, LoginDto } from './dto';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name ) 
    private userModel: Model<User>,
    private jwtService: JwtService
  ){}

  async create(createUserDto: CreateUserDto) : Promise<User>
  {
    try {

      //desestructuramos el objeto createUserDto
      const { password, ...userData } = createUserDto;

      const newUser = new this.userModel({
        password: bcryptjs.hashSync( password ),
        ...userData
      });

      await newUser.save();

      //renombramos password con _
      const { password:_, ...user } = newUser.toJSON();
      return user;

    } catch (error) {
      if( error.code === 11000 ) {
        throw new BadRequestException(`${ createUserDto.email } alerady exists`);
      }

      throw new InternalServerErrorException('Something terrific happen ');
    }
    
  }

  async login( loginDto: LoginDto) : Promise<LoginResponse>
  {
    const { email, password } = loginDto;

    // Verificamos si el usuariio existe por email
    const user = await this.userModel.findOne({ email });

    if( ! user ) {
      throw new UnauthorizedException('Not valid credentials - email');
    }

    if( ! bcryptjs.compareSync(password, user.password)) {
      throw new UnauthorizedException('Not valid credentials - password');
    }

    const { password:_, ...restUser } = user.toJSON();

    return {
      user: restUser,
      token: this.getJwtToken({ id: user.id, })
    }

  }

  async register( registerUserDto: RegisterUserDto ) : Promise<LoginResponse>
  {
    const user = await this.create( registerUserDto );  

    return {
      user: user,
      token: this.getJwtToken({id: user._id })
    }
  }

  async findAll() : Promise<User[]> 
  {
    const users = await this.userModel.find();

    return users;
  }

  async findUserById(id: string) {
    const user = await this.userModel.findById( id );
    const { password:_, ...rest } = user.toJSON();
    return rest;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign( payload );
    return token;
  }
}
