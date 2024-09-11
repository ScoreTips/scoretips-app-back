import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth/auth.controller';
import { UserRepository } from './database/repositories/implementations/user.repository';
import { LoginService } from './services/auth/login/login.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/config/database/prisma.service';
import { RegisterService } from './services/auth/register/register.service';
import { RepositoryEnum } from 'src/shared/generic-enums/repository_enum';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [
    {
      provide: RepositoryEnum.UserRepository,
      useClass: UserRepository,
    },

    LoginService,
    JwtService,
    PrismaService,
    RegisterService,
  ],
  exports: [
    {
      provide: RepositoryEnum.UserRepository,
      useClass: UserRepository,
    },
  ],
})
export class AuthModule {}
