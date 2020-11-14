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

  describe('/api/post (POST)', () => {
    describe('validation', () => {
      it('should properly validate title existence', () => {
        return createPost(app, { ...validPost, title: '' }).expect(400);
      });
      it('should properly validate title min length', () => {
        return createPost(app, { ...validPost, title: '1' }).expect(400);
      });
      it('should properly validate title max length', () => {
        return createPost(app, {
          ...validPost,
          title: new Array(51).fill(1).join(),
        }).expect(400);
      });
      it('should properly validate content blocks existence', () => {
        return createPost(app, { ...validPost, contentBlocks: null }).expect(
          400,
        );
      });
      it('should properly validate content blocks length', () => {
        return createPost(app, { ...validPost, contentBlocks: [] }).expect(400);
      });
      it('should properly validate content blocks type', () => {
        return createPost(app, {
          ...validPost,
          contentBlocks: [{ type: 'unknown', content: 'some string' }],
        }).expect(400);
      });
      it('should properly validate content blocks content', () => {
        return createPost(app, {
          ...validPost,
          contentBlocks: [{ type: 'image', content: null }],
        }).expect(400);
      });

      it('should properly validate tags existence', () => {
        return createPost(app, {
          ...validPost,
          tags: null,
        }).expect(400);
      });
      it('should properly validate tags length', () => {
        return createPost(app, {
          ...validPost,
          tags: ['tag1'],
        }).expect(400);
      });
    });
    it('should create post', () => {
      return createPost(app, validPost).then(({ body }) => {
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

  describe('/api/post/:postId (PATCH)', () => {
    let post;
    beforeEach(async () => {
      const response = await createPost(app, validPost);
      post = response.body;
    });
    describe('validation', () => {
      it('should properly validate title min length', () => {
        return updatePost(app, post.id, { title: '' }).expect(400);
      });
      it('should properly validate title max length', () => {
        return updatePost(app, post.id, {
          title: new Array(51).fill(1).join(),
        }).expect(400);
      });
      it('should properly validate content blocks length', () => {
        return updatePost(app, post.id, { contentBlocks: [] }).expect(400);
      });
      it('should properly validate content blocks type', () => {
        return updatePost(app, post.id, {
          contentBlocks: [{ type: 'unknown', content: 'some string' }],
        }).expect(400);
      });
      it('should properly validate content blocks content', () => {
        return updatePost(app, post.id, {
          contentBlocks: [{ type: 'image', content: null }],
        }).expect(400);
      });
      it('should properly validate tags length', () => {
        return updatePost(app, post.id, {
          tags: ['tag1'],
        }).expect(400);
      });

      it('should properly validate post existence', () => {
        return updatePost(app, -1, {
          title: 'New title',
        }).expect(404);
      });
    });
    it('should properly update post title', async () => {
      const newTitle = 'New title';
      await updatePost(app, post.id, { title: newTitle });
      const updatedPostResponse = await getPost(app, post.id);
      expect(updatedPostResponse.body.title).toBe(newTitle);
    });
  });

  describe('/api/post/:postId (GET)', () => {
    it('should return proper post', async () => {
      const createResponse = await createPost(app, validPost);
      const existingPost = createResponse.body;
      return getPost(app, existingPost.id).expect(200, existingPost);
    });
  });
});

function updatePost(app, postId, updateObject) {
  return request(app.getHttpServer())
    .patch(`/api/post/${postId}`)
    .send(updateObject);
}

function getPost(app, postId) {
  return request(app.getHttpServer()).get(`/api/post/${postId}`);
}

function createPost(app, post) {
  return request(app.getHttpServer()).post('/api/post').send(post);
}
