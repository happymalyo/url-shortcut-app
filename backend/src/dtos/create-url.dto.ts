import { IsUrl, Length } from 'class-validator';

export class CreateUrlDto {
  @IsUrl({}, { message: 'Invalid URL format' })
  originalUrl: string;

  @Length(5, 10, { message: 'Short code must be between 5 and 10 characters' })
  shortCode?: string;
}
