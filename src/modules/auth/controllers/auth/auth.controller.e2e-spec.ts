import { INestApplication } from '@nestjs/common';

import { Test } from '@nestjs/testing';
import request from 'supertest';
import { PrismaService } from '../../../../config/database/prisma.service';

import { AppModule } from 'src/app.module';
import { hash } from 'bcrypt';

describe('Authenticate (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  it('[POST] /login', async () => {
    await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: await hash('123456', 8),
      },
    });

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'johndoe@example.com',
        password: '123456',
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      token: expect.any(String),
      user: expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
        email: expect.any(String),
      }),
    });
  });

  it('[POST] /register', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'John Doe',
        email: 'jhondoe1@gmail.com',
        password: '123456',
      });

    const userInDatabase = await prisma.user.findUnique({
      where: {
        email: 'jhondoe1@gmail.com',
      },
    });

    expect(userInDatabase).toBeTruthy();
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        email: 'jhondoe1@gmail.com',
      }),
    );
  });
});
