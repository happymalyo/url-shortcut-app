import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { UrlService } from '../services/url.service';
import { CreateUrlDto } from '../dtos/create-url.dto';
import { Response } from 'express';

@Controller()
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('api/url')
  async create(@Body() createUrlDto: CreateUrlDto) {
    return this.urlService.createShortUrl(createUrlDto);
  }

  @Get(':shortCode')
  async redirect(@Param('shortCode') shortCode: string, @Res() res: Response) {
    const originalUrl = await this.urlService.getOriginalUrl(shortCode);
    return res.redirect(HttpStatus.FOUND, originalUrl);
  }
}
