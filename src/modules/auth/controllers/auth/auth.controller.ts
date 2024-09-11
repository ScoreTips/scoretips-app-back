import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';

import {
  ILoginResponseDTO,
  IRegisterResponseDTO,
  LoginDTO,
  RegisterDTO,
} from './authController.dto';
import { LoginService } from '../../services/auth/login/login.service';
import { RegisterService } from '../../services/auth/register/register.service';
import { SkipAuth } from 'src/common/decorators/skipAuth.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginService: LoginService,
    private readonly registerService: RegisterService,
  ) {}

  @Get('/token-valid')
  async validToken(): Promise<boolean> {
    return true;
  }

  @SkipAuth()
  @Post('/login')
  @HttpCode(200)
  async loginUser(
    @Body() { email, password }: LoginDTO,
  ): Promise<ILoginResponseDTO> {
    return this.loginService.execute({ email, password });
  }

  @SkipAuth()
  @Post('/register')
  @HttpCode(201)
  async registerUser(
    @Body() { name, email, password }: RegisterDTO,
  ): Promise<IRegisterResponseDTO> {
    return this.registerService.execute({ name, email, password });
  }
}
