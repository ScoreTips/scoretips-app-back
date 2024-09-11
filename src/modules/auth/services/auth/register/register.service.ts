import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from 'src/modules/auth/database/repositories/abstract/IUser.repository';
import { IValidateRegisterUserDTO } from './register.dto';
import { hash } from 'bcrypt';
import { RepositoryEnum } from 'src/shared/generic-enums/repository_enum';

@Injectable()
export class RegisterService {
  constructor(
    @Inject(RepositoryEnum.UserRepository)
    private userRepository: IUserRepository,
  ) {}

  async execute({ name, email, password }: IValidateRegisterUserDTO) {
    const userExists = await this.userRepository.findByEmail({
      email,
    });

    if (userExists) {
      throw new BadRequestException('Email já cadastrado');
    }

    if (!this.isPasswordLengthValid(password)) {
      throw new BadRequestException('Senha deve ter no mínimo 6 caracteres');
    }

    const hashedPassword = await this.hashPassword(password);

    const user = await this.userRepository.createUser({
      name,
      email,
      password: hashedPassword,
    });

    return {
      name: user.name,
      email: user.email,
    };
  }

  private isPasswordLengthValid(password: string): boolean {
    return password.length >= 6;
  }

  private async hashPassword(password: string) {
    const hashedPassword = await hash(
      password,
      Number(process.env.ROUNDS_OF_HASHING),
    );

    return hashedPassword;
  }
}
