import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RepositoryEnum } from 'src/shared/generic-enums/repository_enum';
import { IUserRepository } from 'src/modules/auth/database/repositories/abstract/IUser.repository';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { IValidateUserDTO, UserFiltered } from './login.dto';

@Injectable()
export class LoginService {
  constructor(
    @Inject(RepositoryEnum.UserRepository)
    private userRepository: IUserRepository,
    private jwtService: JwtService,
  ) {}

  async execute({ email, password }: IValidateUserDTO) {
    const userExists = await this.userRepository.findByEmail({
      email,
    });

    if (!userExists) {
      throw new NotFoundException('Email e/ou senha inválidos');
    }

    await this.validateUserPassword({
      inputPassword: password,
      userPassword: userExists.password,
    });

    const userFiltered: UserFiltered = {
      id: userExists.id,
      name: userExists.name,
      email: userExists.email,
    };

    const token = this.jwtService.sign(
      {
        user: userFiltered,
      },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    );

    return {
      token,
      user: userFiltered,
    };
  }

  private async validateUserPassword({ inputPassword, userPassword }: any) {
    const isPasswordMatch = await compare(inputPassword, userPassword);

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Email e/ou senha inválidos');
    }
  }
}
