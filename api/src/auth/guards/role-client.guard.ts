import {
  CACHE_MANAGER,
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Cache } from 'cache-manager';
import * as moment from 'moment';
import * as _ from 'lodash';

@Injectable()
export class RoleClientGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ability = this.reflector.get<string[]>(
      'ability',
      context.getHandler(),
    );
    if (!ability) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const current_user_roles = _.map(user.ability, (item) => {
      return item.action;
    });
    const user_cache = await this.cacheManager.get(
      process.env.JWT_KEY + '_user_' + user.username,
    );

    const banned_time =
      user_cache && user_cache['banned_time']
        ? user_cache['banned_time']
        : null;
    const now = moment().utc().unix();
    if (banned_time && banned_time > 0 && banned_time >= now) {
      throw new UnauthorizedException({
        success: false,
        message: 'Account can not access right now',
        data: null,
      });
    }

    let new_user_roles = [];
    if (user_cache) {
      new_user_roles = user_cache['ability'];
    }

    if (
      process.env.NODE_ENV !== 'development' &&
      new_user_roles.length != current_user_roles.length
    ) {
      // if roles cache change
      throw new UnauthorizedException({
        success: false,
        message: 'Token is revoke, please login again',
        data: null,
      });
    }

    let next = false;

    for (let i = 0; i < current_user_roles.length; i++) {
      // check require role
      if (ability.includes(current_user_roles[i])) {
        next = true;
        break;
      }
    }
    if (!next) {
      throw new UnauthorizedException({
        success: false,
        message: 'You do not have permission',
        data: null,
      });
    }
    return next;
  }
}
