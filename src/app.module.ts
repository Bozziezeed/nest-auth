import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

// @Module({
//   imports: [
//     ConfigModule.forRoot({
//       envFilePath: '.development.env',
//       isGlobal: true,
//     }),
//     TypeOrmModule.forRoot({
//       type: 'mysql',
//       host: 'localhost',
//       port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
//       username: process.env.DATABASE_USER,
//       password: process.env.DATABASE_PASSWORD,
//       database: process.env.DATABASE_NAME,
//       entities: [User],
//       synchronize: true,
//     }),
//     TypeOrmModule.forFeature([User]),
//     JwtModule.register({
//       secret: process.env.JWT_SECRETKEY,
//       signOptions: { expiresIn: '1d' },
//     }),
//   ],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [User],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRETKEY,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
