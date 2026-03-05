/**
 * @module backend/test/events.e2e-spec
 * @description E2E тесты для модуля событий
 */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Events API (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let eventId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    // Регистрация тестового пользователя
    const registerRes = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        email: `test-${Date.now()}@example.com`,
        password: 'testpass123',
        name: 'Test User',
      });
    authToken = registerRes.body.token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/events', () => {
    it('должен создать новое событие', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/events')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Event',
          description: 'Test description',
          date: '2026-06-15',
          time: '10:00',
          location: 'Moscow',
          category: 'meetup',
          maxParticipants: 50,
        })
        .expect(201);

      expect(res.body).toHaveProperty('id');
      expect(res.body.title).toBe('Test Event');
      eventId = res.body.id;
    });

    it('должен отклонить без авторизации', async () => {
      await request(app.getHttpServer())
        .post('/api/events')
        .send({ title: 'Test' })
        .expect(401);
    });
  });

  describe('GET /api/events', () => {
    it('должен вернуть список событий', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/events')
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });

    it('должен фильтровать по категории', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/events?category=meetup')
        .expect(200);

      res.body.forEach((event: any) => {
        expect(event.category).toBe('meetup');
      });
    });
  });

  describe('GET /api/events/:id', () => {
    it('должен вернуть событие по ID', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/events/${eventId}`)
        .expect(200);

      expect(res.body.id).toBe(eventId);
    });

    it('должен вернуть 404 для несуществующего', async () => {
      await request(app.getHttpServer())
        .get('/api/events/non-existent-id')
        .expect(404);
    });
  });

  describe('POST /api/events/:id/join', () => {
    it('должен присоединить пользователя к событию', async () => {
      await request(app.getHttpServer())
        .post(`/api/events/${eventId}/join`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(201);
    });
  });

  describe('POST /api/events/:id/leave', () => {
    it('должен удалить пользователя из участников', async () => {
      await request(app.getHttpServer())
        .post(`/api/events/${eventId}/leave`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(201);
    });
  });

  describe('PUT /api/events/:id', () => {
    it('должен обновить событие', async () => {
      const res = await request(app.getHttpServer())
        .put(`/api/events/${eventId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Updated Event' })
        .expect(200);

      expect(res.body.title).toBe('Updated Event');
    });
  });

  describe('DELETE /api/events/:id', () => {
    it('должен удалить событие', async () => {
      await request(app.getHttpServer())
        .delete(`/api/events/${eventId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });
  });
});
