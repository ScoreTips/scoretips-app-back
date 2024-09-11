import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';
import { RegisterService } from './register.service';
import { Test, TestingModule } from '@nestjs/testing';
import { RepositoryEnum } from 'src/shared/generic-enums/repository_enum';
import { BadRequestException } from '@nestjs/common';
import { IValidateRegisterUserDTO } from './register.dto';
import { hash } from 'bcrypt';
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';

describe('RegisterService', () => {
  let inMemoryUserRepository: InMemoryUserRepository;
  let registerService: RegisterService;

  beforeAll(() => {
    process.env.ROUNDS_OF_HASHING = '10';
  });

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterService,
        {
          provide: RepositoryEnum.UserRepository,
          useClass: InMemoryUserRepository,
        },
      ],
    }).compile();

    inMemoryUserRepository = moduleRef.get<InMemoryUserRepository>(
      RepositoryEnum.UserRepository,
    );
    registerService = new RegisterService(inMemoryUserRepository);
  });

  describe('execute', () => {
    it('should register a new user', async () => {
      const registerUserDto: IValidateRegisterUserDTO = {
        email: 'johnDoe@gmail.com',
        name: 'John Doe',
        password: '123456',
      };

      const result = await registerService.execute(registerUserDto);

      expect(result).toEqual(
        expect.objectContaining({
          email: 'johnDoe@gmail.com',
          name: 'John Doe',
        }),
      );

      const createdUser = inMemoryUserRepository.users.find(
        (user) => user.email === 'johnDoe@gmail.com',
      );
      expect(createdUser).toBeDefined();
      expect(createdUser.password).not.toBe('123456');
    });

    it('should not register a user with an existing email', async () => {
      const existingUser = {
        createdAt: new Date(),
        email: 'johnDoe@gmail.com',
        name: 'John Doe',
        password: await hash('123456', 10),
        updatedAt: new Date(),
        id: '1',
      };

      inMemoryUserRepository.users.push(existingUser);

      const registerUserDto: IValidateRegisterUserDTO = {
        email: 'johnDoe@gmail.com',
        name: 'John Doe',
        password: '123456',
      };

      await expect(registerService.execute(registerUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should not register a user with a short password', async () => {
      const registerUserDto: IValidateRegisterUserDTO = {
        email: 'johnDoe@gmail.com',
        name: 'John Doe',
        password: '123',
      };

      await expect(registerService.execute(registerUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
