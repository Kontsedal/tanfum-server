import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import * as path from 'path';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidUnknownValues: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/assets/image (POST)', () => {
    it('should upload image successfully', () => {
      request(app.getHttpServer())
        .post('/api/assets/image')
        .attach(
          'file',
          path.resolve('./assets/71769d2259012c32ea253503d190721a.jpg'),
        )
        .expect(201)
        .expect((res) => {
          request(app.getHttpServer()).post(res.body.url).expect(200);
        });
    });
  });
});
