import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';
import { InjectModel } from '@nestjs/mongoose';
import {
  AuthAdminEntity,
  AuthAdminEntityDocument,
} from './entities/admin.entity';
import {
  AuthGroupEntity,
  AuthGroupEntityDocument,
} from './entities/group.entity';
import { AuthRoleEntity, AuthRoleEntityDocument } from './entities/role.entity';
import { UserEntity, UserEntityDocument } from '../user/entities/user.entity';
import { Model, PaginateModel } from 'mongoose';
import { PostLoginAdminDto } from './dto/post-login-admin.dto';
import * as bcrypt from 'bcrypt';
import * as _ from 'lodash';
import { LoginClientDto } from './dto/login-client.dto';
import { ConfigService } from '@nestjs/config';
import {RegisterClientDto} from "./dto/register-client.dto";
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private jwtService: JwtService,
    @InjectModel(UserEntity.name)
    private modelUser: PaginateModel<UserEntityDocument>,
    @InjectModel(AuthAdminEntity.name)
    private modelAdmin: Model<AuthAdminEntityDocument>,
    @InjectModel(AuthGroupEntity.name)
    private modelGroup: Model<AuthGroupEntityDocument>,
    @InjectModel(AuthRoleEntity.name)
    private modelRole: Model<AuthRoleEntityDocument>,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    return {
      username,
      password,
    };
  }

  async postLoginAdmin(dto: PostLoginAdminDto) {
    try {
      const { username, password } = dto;

      const userAdmin = await this.modelAdmin
        .findOne({
          username,
          is_active: true,
        })
        .populate({
          path: 'group_id',
          populate: 'roles',
        });

      if (!userAdmin) {
        throw new UnauthorizedException({
          success: false,
          message: 'Admin not found',
          data: null,
        });
      }

      const roles = _.map(userAdmin.group_id.roles, (role) => {
        return role['key'];
      });

      const ability = _.map(roles, (role) => {
        return {
          subject: userAdmin.group_id.name,
          action: role,
        };
      });

      const match = await bcrypt.compare(password, userAdmin['password']);

      if (!match) {
        throw new UnauthorizedException({
          success: false,
          message: 'Wrong username or password',
          data: null,
        });
      }
      const payload = {
        id: userAdmin.id,
        type: 'admin',
        username: userAdmin.username,
        ability,
      };

      // set cache
      await this.cacheManager.set(
        this.configService.get('JWT_KEY') + '_' + dto.username,
        payload,
        { ttl: 0 },
      );

      return this.jwtService.sign(
        payload,
        process.env.NODE_ENV !== 'development'
          ? {
              secret: this.configService.get('JWT_KEY'),
              expiresIn: '1d',
              algorithm: 'HS256',
            }
          : {},
      );
    } catch (e) {
      throw new UnauthorizedException({
        success: false,
        message: e.message,
        data: null,
      });
    }
  }

  async postLoginClient(dto: LoginClientDto) {
    try {
      const { username, password } = dto;
      const user = await this.modelUser
        .findOne({
          username,
          status: 'ACTIVE',
        })
        .populate({
          path: 'group_id',
          populate: 'roles',
        });

      if (!user) {
        throw new UnauthorizedException({
          success: false,
          message: 'User not found',
          data: null,
        });
      }

      const roles = _.map(user.group_id.roles, (role) => {
        return role['key'];
      });

      const ability = _.map(roles, (role) => {
        return {
          subject: user.group_id.name,
          action: role,
        };
      });

      const match = await bcrypt.compare(password, user['password']);

      if (!match) {
        throw new UnauthorizedException({
          success: false,
          message: 'Wrong username or password',
          data: null,
        });
      }
      const payload = {
        user_id: user.id,
        type: 'client',
        username: user.username,
        email: user.email,
        ability,
      };

      // set cache
      await this.cacheManager.set(
        process.env.JWT_KEY + '_' + dto.username,
        payload,
        { ttl: 0 },
      );

      return this.jwtService.sign(
        payload,
        process.env.NODE_ENV !== 'development'
          ? {
              secret: process.env.JWT_KEY,
              expiresIn: '1d',
              algorithm: 'HS256',
            }
          : {},
      );
    } catch (e) {
      throw new UnauthorizedException({
        success: false,
        message: e.message,
        data: null,
      });
    }
  }

  async postRegisterClient(dto: RegisterClientDto) {
    try {
      const { username, email, password } = dto;
      const user = await this.modelUser
          .findOne({
            $or: [
              {username},
              {email}
            ],
            status: 'ACTIVE',
          })
          .populate({
            path: 'group_id',
            populate: 'roles',
          });

      if (user) {
        throw new UnauthorizedException({
          success: false,
          message: 'User is exists',
          data: null,
        });
      }
      let group = await this.modelGroup.findOne({ name: 'User' }) // group User default

      let newUser = await this.modelUser.create({
        username,
        password: await bcrypt.hash(password, 8),
        email,
        user_type: 'L',
        status: 'active',
        group_id : group._id,
        token: uuidv4(),
      });

      return newUser
    } catch (e) {
      throw new UnauthorizedException({
        success: false,
        message: e.message,
        data: null,
      });
    }
  }
}
