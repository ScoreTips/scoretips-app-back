import { User } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { IUserRepository } from 'src/modules/auth/database/repositories/abstract/IUser.repository';
import { IFindUserByEmail } from 'src/modules/auth/database/repositories/abstract/userRepository.dto';

export class InMemoryUserRepository implements IUserRepository {
  public users: User[] = [];

  async findByEmail({ email }: IFindUserByEmail): Promise<User> {
    const user = this.users.find((user) => user.email === email);

    return user;
  }

  async createUser(data: User): Promise<User> {
    const newUser = {
      ...data,
      id: randomUUID(),
    };

    this.users.push(newUser);

    return newUser;
  }
}
