/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { UrlService } from './url.service';
import { Url } from '../entities/url.entity';
import { CreateUrlDto } from '../dtos/create-url.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { nanoid } from 'nanoid';

jest.mock('nanoid', () => ({
  nanoid: jest.fn().mockReturnValue('mockedId'),
}));

describe('UrlService', () => {
  let service: UrlService;
  let urlRepository: Repository<Url>;
  let queryBuilder: SelectQueryBuilder<Url>;

  beforeEach(async () => {
    queryBuilder = {
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn(),
    } as unknown as SelectQueryBuilder<Url>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlService,
        {
          provide: getRepositoryToken(Url),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            createQueryBuilder: jest.fn(() => queryBuilder),
          },
        },
      ],
    }).compile();

    service = module.get<UrlService>(UrlService);
    urlRepository = module.get<Repository<Url>>(getRepositoryToken(Url));
  });

  describe('createShortUrl', () => {
    it('should create a short URL with generated code when no shortCode provided', async () => {
      const createUrlDto: CreateUrlDto = { originalUrl: 'https://example.com' };
      const mockUrl = {
        id: 1,
        originalUrl: 'https://example.com',
        shortCode: 'mockedId',
        visitCount: 0,
      } as Url;

      (urlRepository.findOne as jest.Mock).mockResolvedValue(null);
      (urlRepository.create as jest.Mock).mockReturnValue(mockUrl);
      (urlRepository.save as jest.Mock).mockResolvedValue(mockUrl);

      const result = await service.createShortUrl(createUrlDto);

      expect(result).toEqual(mockUrl);
      expect(nanoid).toHaveBeenCalledWith(6);
      expect(urlRepository.create).toHaveBeenCalledWith({
        originalUrl: 'https://example.com',
        shortCode: 'mockedId',
      });
    });

    it('should throw ConflictException when shortCode already exists', async () => {
      const createUrlDto: CreateUrlDto = {
        originalUrl: 'https://example.com',
        shortCode: 'existing',
      };
      const existingUrl = { shortCode: 'existing' } as Url;

      (urlRepository.findOne as jest.Mock).mockResolvedValue(existingUrl);

      await expect(service.createShortUrl(createUrlDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('getOriginalUrl', () => {
    it('should return original URL and increment visit count', async () => {
      const mockUrl = {
        originalUrl: 'https://example.com',
        shortCode: 'abc123',
        visitCount: 0,
      } as Url;

      (queryBuilder.getOne as jest.Mock).mockResolvedValue(mockUrl);
      (urlRepository.save as jest.Mock).mockResolvedValue(mockUrl);

      const result = await service.getOriginalUrl('abc123');

      expect(result).toBe('https://example.com');
      expect(mockUrl.visitCount).toBe(1);
      expect(queryBuilder.where).toHaveBeenCalledWith(
        'LOWER(short_code) = LOWER(:shortCode)',
        { shortCode: 'abc123' },
      );

      expect(urlRepository.save).toHaveBeenCalledWith(mockUrl);
    });

    it('should throw NotFoundException when URL not found', async () => {
      (queryBuilder.getOne as jest.Mock).mockResolvedValue(null);

      await expect(service.getOriginalUrl('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
