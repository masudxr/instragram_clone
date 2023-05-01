import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    JwtModule,
    UsersModule,
    TypeOrmModule.forFeature([Profile]),
    MulterModule.register({
      dest: './uploads/profile',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'files'),
    }),
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [TypeOrmModule, ProfileService],
})
export class ProfileModule {}
