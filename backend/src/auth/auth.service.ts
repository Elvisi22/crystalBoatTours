import { Injectable, Logger, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { timingSafeEqual } from 'crypto';

/**
 * Single-admin authentication. Credentials live in env (never in the repo);
 * a successful login returns a short-lived JWT used to access /api/admin/*.
 */
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  // Very small brute-force guard: lock after too many failures for a window.
  private attempts = 0;
  private lockedUntil = 0;

  constructor(
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
  ) {}

  private safeEqual(a: string, b: string): boolean {
    const ba = Buffer.from(a);
    const bb = Buffer.from(b);
    if (ba.length !== bb.length) return false;
    return timingSafeEqual(ba, bb);
  }

  login(username: string, password: string): { accessToken: string; expiresIn: number } {
    const expectedUser = this.config.get<string>('ADMIN_USERNAME');
    const expectedPass = this.config.get<string>('ADMIN_PASSWORD');

    if (!expectedUser || !expectedPass) {
      throw new ServiceUnavailableException(
        'Admin login is not configured. Set ADMIN_USERNAME and ADMIN_PASSWORD.',
      );
    }

    if (Date.now() < this.lockedUntil) {
      throw new UnauthorizedException('Too many attempts. Try again shortly.');
    }

    const ok =
      this.safeEqual(username || '', expectedUser) &&
      this.safeEqual(password || '', expectedPass);

    if (!ok) {
      this.attempts += 1;
      if (this.attempts >= 5) {
        this.lockedUntil = Date.now() + 5 * 60 * 1000; // 5-minute lockout
        this.attempts = 0;
        this.logger.warn('Admin login locked for 5 minutes after repeated failures.');
      }
      throw new UnauthorizedException('Invalid username or password.');
    }

    this.attempts = 0;
    const expiresIn = 8 * 60 * 60; // 8 hours (seconds)
    const accessToken = this.jwt.sign({ sub: 'admin', role: 'admin' }, { expiresIn });
    return { accessToken, expiresIn };
  }
}
