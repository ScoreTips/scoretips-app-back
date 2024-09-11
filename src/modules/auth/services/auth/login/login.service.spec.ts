import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';
import { LoginService } from './login.service';
import { JwtService, JwtModule } from '@nestjs/jwt';
import { hash } from 'bcrypt';
import { Test, TestingModule } from '@nestjs/testing';
import { RepositoryEnum } from 'src/shared/generic-enums/repository_enum';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';

describe('LoginService', () => {
  let inMemoryUserRepository: InMemoryUserRepository;
  let loginService: LoginService;
  let jwtService: JwtService;

  beforeAll(() => {
    process.env.JWT_SECRET = 'testSecret';
    process.env.JWT_EXPIRES_IN = '1h';
    process.env.ROUNDS_OF_HASHING = '10';
  });

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
        }),
      ],
      providers: [
        LoginService,
        {
          provide: RepositoryEnum.UserRepository,
          useClass: InMemoryUserRepository,
        },
      ],
    }).compile();

    jwtService = moduleRef.get<JwtService>(JwtService);
    inMemoryUserRepository = moduleRef.get<InMemoryUserRepository>(
      RepositoryEnum.UserRepository,
    );
    loginService = new LoginService(inMemoryUserRepository, jwtService);
  });

  describe('execute', () => {
    it('should be able to authenticate an user', async () => {
      const user = {
        createdAt: new Date(),
        email: 'johnDoe@gmail.com',
        name: 'John Doe',
        password: await hash('123456', Number(process.env.ROUNDS_OF_HASHING)),
        updatedAt: new Date(),
        id: '1',
      };

      inMemoryUserRepository.users.push(user);

      const result = await loginService.execute({
        email: 'johnDoe@gmail.com',
        password: '123456',
      });

      expect(result).toEqual(
        expect.objectContaining({
          token: expect.any(String),
        }),
      );
    });

    it('should not be able to authenticate an user with wrong email', async () => {
      const user = {
        createdAt: new Date(),
        email: 'wrongpassword@gmail.com',
        name: 'John Doe',
        password: 'wrongpassword',
        updatedAt: new Date(),
        id: '1',
      };

      inMemoryUserRepository.users.push(user);

      await expect(
        loginService.execute({
          email: 'johnDoe@gmail.com',
          password: '123456',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should not be able to authenticate a user with wrong password', async () => {
      const user = {
        createdAt: new Date(),
        email: 'johnDoe@gmail.com',
        name: 'John Doe',
        password: await hash('123456', Number(process.env.ROUNDS_OF_HASHING)),
        updatedAt: new Date(),
        id: '1',
      };

      inMemoryUserRepository.users.push(user);

      await expect(
        loginService.execute({
          email: 'johnDoe@gmail.com',
          password: 'wrongpassword',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
