import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, private readonly jwt: JwtService) {}

  async signup(email: string, password: string, name?: string) {
    const user = await this.usersService.create(email, password, name);
    const token = await this.signToken(user._id, user.email, user.role);
    return { user, accessToken: token };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await this.usersService.validatePassword(user as any, password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    const token = await this.signToken(user._id, user.email, user.role);
    return { user, accessToken: token };
  }

  private async signToken(sub: any, email: string, role: string) {
    return this.jwt.signAsync({ sub: String(sub), email, role });
  }
}


