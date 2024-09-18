/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AppService } from './app.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';

@Controller('api')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private jwtService: JwtService,
  ) {}

  @Post('register')
  async register(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    if (!name || !email || !password) {
      throw new HttpException(
        {
          success: false,
          message: 'Please provide valid input',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const duplicate_user = await this.appService.findOne({ email });

    if (duplicate_user) {
      throw new HttpException(
        {
          success: false,
          message: 'Email already exists',
        },
        HttpStatus.CONFLICT,
      );
    }

    const hashedPassword = await bcrypt.hash(password.toString(), 12);

    const user = await this.appService.create({
      name,
      email,
      password: hashedPassword,
    });

    const { password: hashed, ...result } = user;
    return { success: true, message: 'Register success', data: result };
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    if (!email || !password) {
      throw new HttpException(
        {
          succes: false,
          message: 'Please provide valid input',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.appService.findOne({ email });

    if (!user) {
      // throw new BadRequestException('Invalid credentials');
      throw new HttpException(
        {
          success: false,
          message: 'Email not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    if (!(await bcrypt.compare(password, user.password))) {
      // throw new BadRequestException('Invalid credentials');
      throw new HttpException(
        {
          success: false,
          message: 'Invalid password',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const jwt = await this.jwtService.signAsync({ id: user.id });

    response.cookie('jwt', jwt, { httpOnly: true });

    return { success: true, message: 'Login success' };
  }

  @Get('user')
  async user(@Req() request: Request) {
    try {
      const cookie = request.cookies['jwt'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        // throw new UnauthorizedException();
        throw new HttpException(
          {
            success: false,
            message: 'Unauthorized',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }

      const user = await this.appService.findOne({ id: data.id });

      const { password, ...result } = user;

      return result;
    } catch (e) {
      throw new HttpException(
        {
          success: false,
          message: 'Unauthorized',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');

    return { success: true, message: 'success' };
  }
}
