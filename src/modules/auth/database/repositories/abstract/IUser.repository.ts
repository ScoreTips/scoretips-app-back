import { User } from '@prisma/client';
import { ICreateUser, IFindUserByEmail } from './userRepository.dto';

export interface IUserRepository {
  findByEmail(data: IFindUserByEmail): Promise<User>;
  createUser(data: ICreateUser): Promise<User>;
}
