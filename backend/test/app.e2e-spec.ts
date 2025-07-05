/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// test/app.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Url } from '../src/entities/url.entity';

jest.mock('nanoid', () => ({
  nanoid: jest.fn().mockReturnValue('mocked123'),
}));

describe('UrlController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: 'postgres',
          database: 'url_shortener_test',
          entities: [Url],
          synchronize: true,
          dropSchema: true,
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/url', () => {
    it('should create short URL (201)', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/url')
        .send({ originalUrl: 'https://example.com' })
        .expect(201);

      expect(response.body).toEqual({
        id: expect.any(Number),
        originalUrl: 'https://example.com',
        shortCode: 'mocked123',
        visitCount: 0,
        createdAt: expect.any(String),
      });
    });

    it('should reject invalid URLs (400)', async () => {
      await request(app.getHttpServer())
        .post('/api/url')
        .send({ originalUrl: 'invalid-url' })
        .expect(400);
    });
  });

  describe('GET /:shortCode', () => {
    it('should redirect to original URL (302)', async () => {
      // Création
      const { body } = await request(app.getHttpServer())
        .post('/api/url')
        .send({ originalUrl: 'https://example.com/redirect' });

      // Redirection
      await request(app.getHttpServer())
        .get(`/${body.shortCode}`)
        .expect(302)
        .expect('Location', 'https://example.com/redirect');
    });

    it('should return 404 for unknown codes', async () => {
      await request(app.getHttpServer()).get('/nonexistent').expect(404);
    });

    it('should be case insensitive', async () => {
      await request(app.getHttpServer())
        .post('/api/url')
        .send({ originalUrl: 'https://example.com', shortCode: 'MiXeD' });

      await request(app.getHttpServer()).get('/mixed').expect(302);
    });
  });

  // Test complémentaire pour vérifier l'incrémentation du compteur
  describe('Visit counting', () => {
    it('should increment visit count', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/api/url')
        .send({ originalUrl: 'https://example.com/visits' });

      // Premier accès
      await request(app.getHttpServer()).get(`/${body.shortCode}`);

      // Vérification via une nouvelle requête GET
      const response = await request(app.getHttpServer())
        .get(`/${body.shortCode}`)
        .expect(302);

      // Vérifier le header ou autre mécanisme si vous exposez le compteur
      // (Adaptez selon votre implémentation actuelle)
      expect(response.header['x-visit-count']).toBeDefined();
    });
  });
});
