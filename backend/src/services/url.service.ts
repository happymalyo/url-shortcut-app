import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Url } from '../entities/url.entity';
import { CreateUrlDto } from '../dtos/create-url.dto';
import { nanoid } from 'nanoid';

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(Url)
    private urlRepository: Repository<Url>,
  ) {}

  async createShortUrl(createUrlDto: CreateUrlDto): Promise<Url> {
    const { originalUrl, shortCode } = createUrlDto;

    // Si aucun shortCode n'est fourni, en générer un
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const code: string = shortCode ?? nanoid(6);

    // Vérifier si le code existe déjà
    const existingUrl = await this.urlRepository.findOne({
      where: { shortCode: code },
    });
    if (existingUrl) {
      throw new ConflictException('Short code already in use');
    }

    // Créer et sauvegarder l'URL
    const url = this.urlRepository.create({
      originalUrl,
      shortCode: code,
    });

    return this.urlRepository.save(url);
  }

  async getOriginalUrl(shortCode: string): Promise<string> {
    const url = await this.urlRepository.findOne({ where: { shortCode } });
    if (!url) {
      throw new NotFoundException('URL not found');
    }

    // Incrémenter le compteur de visites
    url.visitCount += 1;
    await this.urlRepository.save(url);

    return url.originalUrl;
  }

  async getUrlStats(shortCode: string): Promise<Url> {
    const url = await this.urlRepository.findOne({ where: { shortCode } });
    if (!url) {
      throw new NotFoundException('URL not found');
    }
    return url;
  }
}
