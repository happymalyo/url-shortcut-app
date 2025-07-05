import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Url } from './entities/url.entity';
import { UrlController } from './controllers/url.controller';
import { UrlService } from './services/url.service';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'url_shortcut',
      entities: ['dist/**/*.entity{.ts,.js}'],
      migrations: ['dist/migrations/*{.ts,.js}'],
      synchronize: false,
    }),
    TypeOrmModule.forFeature([Url]),
  ],
  controllers: [UrlController],
  providers: [UrlService],
})
export class AppModule {}
