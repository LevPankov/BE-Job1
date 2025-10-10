import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/mydb';
process.env.JWT_SECRET = 'Test secret';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should register a new user', () => {
    return request(app.getHttpServer())
      .post('/auth/reg')
      .send({
        login: 'testuser',
        email: 'test@example.com',
        password: 'testpassword123',
        age: 25,
        description: "blabla"
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toBeDefined();
        expect(res.body.password).toBeUndefined();
      });
  });

  it('should send error while register new user with bad data', () => {
    return request(app.getHttpServer())
      .post('/auth/reg')
      .send({
        login: '',
        email: '',
        password: '',
        age: 25,
        description: ""
      })
      .expect(400)
  });

  it('should return JWT token in login success', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        login: 'testuser',
        password: 'testpassword123',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.access_token).toBeDefined();

        authToken = res.body.access_token;
      });
  });

  it('should return error in login error', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        login: 'testuser',
        password: 'badpassword',
      })
      .expect(401);
  });

  it('should return this user info', () => {
    return request(app.getHttpServer())
      .get('/user/get/my')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.login).toBe('testuser');
        expect(res.body.email).toBe('test@example.com');
        expect(res.body.age).toBe(25);
        expect(res.body.description).toBe('blabla');
        expect(res.body.password_hash).toBeDefined();
      });
  });

  it('should fail without token', () => {
    return request(app.getHttpServer())
      .get('/user/get/my')
      .expect(401);
  });

  it('should return all users info', () => {
    return request(app.getHttpServer())
      .get('/user/get/all')
      .set('Authorization', `Bearer ${authToken}`)
      .query({ 'page': -1 })
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        const thisUser = res.body.find(user => user.login === 'testuser');
        expect(thisUser).toBeDefined();
      });
  });

  it('should return another user info without password_hash', () => {
    return request(app.getHttpServer())
      .get('/user/get')
      .set('Authorization', `Bearer ${authToken}`)
      .query({'login': 'testuser'})
      .expect(200)
      .expect((res) => {
        expect(res.body.login).toBe('testuser');
        expect(res.body.email).toBe('test@example.com');
        expect(res.body.age).toBe(25);
        expect(res.body.description).toBe('blabla');
        expect(res.body.password_hash).toBeUndefined();
      });
  });
  
  it('should update user info', async () => {
    await request(app.getHttpServer())
      .patch('/user/update')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        'age' : 20,
        'description' : 'tralala'
      })
      .expect(200);
      
    return request(app.getHttpServer())
      .get('/user/get/my')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.login).toBe('testuser');
        expect(res.body.email).toBe('test@example.com');
        expect(res.body.age).toBe(20);
        expect(res.body.description).toBe('tralala');
        expect(res.body.password_hash).toBeDefined();
      });
  })

  it('should soft-delete user', async () => {
    await request(app.getHttpServer())
      .delete('/user/delete')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    await request(app.getHttpServer())
      .get('/user/get/all')
      .set('Authorization', `Bearer ${authToken}`)
      .query({ 'page': -1 })
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        const thisUser = res.body.find(user => user.login === 'testuser');
        expect(thisUser).toBeUndefined();
      });

    await request(app.getHttpServer())
      .get('/user/get/all')
      .set('Authorization', `Bearer ${authToken}`)
      .query({ 'page': -2 })
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        const thisUser = res.body.find(user => user.login === 'testuser');
        expect(thisUser).toBeDefined();
      });
  });

   it('should hard-delete user', async () => {
    await request(app.getHttpServer())
      .delete('/user/hard-delete')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    await request(app.getHttpServer())
      .get('/user/get/all')
      .set('Authorization', `Bearer ${authToken}`)
      .query({ 'page': -2 })
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        const thisUser = res.body.find(user => user.login === 'testuser');
        expect(thisUser).toBeUndefined();
      });
  });
});
