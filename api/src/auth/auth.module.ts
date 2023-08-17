import { CacheModule, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AdminStrategy } from './strategies/admin.stagegy';
import {
  AuthAdminEntity,
  AuthAdminEntitySchema,
} from './entities/admin.entity';
import { AuthRoleEntity, AuthRoleEntitySchema } from './entities/role.entity';
import { UserEntity, UserEntitySchema } from '../user/entities/user.entity';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AuthGroupEntity,
  AuthGroupEntitySchema,
} from './entities/group.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      envFilePath: [
        '.env',
        '.env.development',
        '.env.testnet',
        '.env.production',
      ],
    }),
    MongooseModule.forFeature([
      { name: UserEntity.name, schema: UserEntitySchema },
      { name: AuthAdminEntity.name, schema: AuthAdminEntitySchema },
      { name: AuthGroupEntity.name, schema: AuthGroupEntitySchema },
      { name: AuthRoleEntity.name, schema: AuthRoleEntitySchema },
    ]),
    PassportModule,
    CacheModule.register(),
    JwtModule.register({
      secret: process.env.JWT_KEY,
      signOptions:
        process.env.NODE_ENV !== 'development' ? { expiresIn: '1d' } : {},
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, AdminStrategy],
  exports: [AuthService],
})
export class AuthModule {}
