import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

const validPost = {
  title: 'My first post',
  contentBlocks: [
    {
      type: 'text',
      content: 'sup',
    },
    {
      type: 'video',
      content: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    },
    {
      type: 'image',
      content: 'https://memepedia.ru/wp-content/uploads/2017/04/wat.jpg',
    },
  ],
  tags: ['my', 'first', 'post'],
};

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
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

  afterEach(async () => {
    await app.close();
  });

  describe('/api/post (POST)', () => {
    describe('validation', () => {
      it('should properly validate title existence', () => {
        return request(app.getHttpServer())
          .post('/api/post')
          .send({ ...validPost, title: '' })
          .expect(400);
      });
      it('should properly validate title min length', () => {
        return request(app.getHttpServer())
          .post('/api/post')
          .send({ ...validPost, title: '1' })
          .expect(400);
      });
      it('should properly validate title max length', () => {
        return request(app.getHttpServer())
          .post('/api/post')
          .send({ ...validPost, title: new Array(51).fill(1).join() })
          .expect(400);
      });
      it('should properly validate content blocks existence', () => {
        return request(app.getHttpServer())
          .post('/api/post')
          .send({ ...validPost, contentBlocks: null })
          .expect(400);
      });
      it('should properly validate content blocks length', () => {
        return request(app.getHttpServer())
          .post('/api/post')
          .send({ ...validPost, contentBlocks: [] })
          .expect(400);
      });
      it('should properly validate content blocks type', () => {
        return request(app.getHttpServer())
          .post('/api/post')
          .send({
            ...validPost,
            contentBlocks: [{ type: 'unknown', content: 'some string' }],
          })
          .expect(400);
      });
      it('should properly validate content blocks content', () => {
        return request(app.getHttpServer())
          .post('/api/post')
          .send({
            ...validPost,
            contentBlocks: [{ type: 'image', content: null }],
          })
          .expect(400);
      });

      it('should properly validate tags existence', () => {
        return request(app.getHttpServer())
          .post('/api/post')
          .send({
            ...validPost,
            tags: null,
          })
          .expect(400);
      });
      it('should properly validate tags length', () => {
        return request(app.getHttpServer())
          .post('/api/post')
          .send({
            ...validPost,
            tags: ['tag1'],
          })
          .expect(400);
      });
    });
    it('should create post', () => {
      return request(app.getHttpServer())
        .post('/api/post')
        .send({ ...validPost })
        .then(({ body }) => {
          expect(body).toMatchObject({
            id: expect.any(Number),
            ...validPost,
            contentBlocks: validPost.contentBlocks.map((block) => ({
              id: expect.any(Number),
              ...block,
            })),
            tags: validPost.tags.map((tag) => ({
              id: expect.any(Number),
              name: tag,
            })),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          });
        });
    });
  });
});
