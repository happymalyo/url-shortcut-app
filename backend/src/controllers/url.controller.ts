/* eslint-disable @typescript-eslint/no-unused-vars */
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

@Controller('api/url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post()
  async create(@Body() createUrlDto: CreateUrlDto) {
    return this.urlService.createShortUrl(createUrlDto);
  }

  @Get(':shortCode')
  async redirect(@Param('shortCode') shortCode: string, @Res() res: Response) {
    try {
      const originalUrl = await this.urlService.getOriginalUrl(shortCode);
      return res.redirect(HttpStatus.PERMANENT_REDIRECT, originalUrl);
    } catch (error) {
      return res.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'URL not found',
      });
    }
  }

  @Get(':shortCode/stats')
  async getStats(@Param('shortCode') shortCode: string) {
    return this.urlService.getUrlStats(shortCode);
  }
}
