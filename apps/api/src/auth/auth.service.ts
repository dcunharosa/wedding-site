import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { LoginDto } from '@wedding/shared';
import { JwtPayload, AuthTokens } from '@wedding/shared';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private auditService: AuditService,
  ) {}

  /**
   * Hash a password using Argon2
   */
  async hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
  }

  /**
   * Verify a password against its hash
   */
  async verifyPassword(hash: string, password: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, password);
    } catch {
      return false;
    }
  }

  /**
   * Authenticate admin user and return JWT token
   */
  async login(dto: LoginDto, ip?: string): Promise<AuthTokens> {
    // Find admin user
    const admin = await this.prisma.adminUser.findUnique({
      where: { email: dto.email },
    });

    if (!admin) {
      // Log failed attempt
      await this.auditService.log({
        actorType: 'SYSTEM',
        action: 'ADMIN_LOGIN_FAILED',
        entityType: 'AdminUser',
        entityId: dto.email,
        metadata: { reason: 'user_not_found', ip },
      });

      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await this.verifyPassword(admin.passwordHash, dto.password);

    if (!isPasswordValid) {
      // Log failed attempt
      await this.auditService.log({
        actorType: 'ADMIN',
        actorAdminId: admin.id,
        action: 'ADMIN_LOGIN_FAILED',
        entityType: 'AdminUser',
        entityId: admin.id,
        metadata: { reason: 'invalid_password', ip },
      });

      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login
    await this.prisma.adminUser.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate JWT
    const payload: JwtPayload = {
      sub: admin.id,
      email: admin.email,
      role: admin.role as 'SUPER_ADMIN' | 'ADMIN',
    };

    const accessToken = this.jwtService.sign(payload);

    // Log successful login
    await this.auditService.log({
      actorType: 'ADMIN',
      actorAdminId: admin.id,
      action: 'ADMIN_LOGIN',
      entityType: 'AdminUser',
      entityId: admin.id,
      metadata: { ip },
    });

    return {
      accessToken,
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    };
  }

  /**
   * Validate JWT payload and return admin user
   */
  async validateUser(payload: JwtPayload) {
    const admin = await this.prisma.adminUser.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        lastLoginAt: true,
      },
    });

    if (!admin) {
      throw new UnauthorizedException('Invalid token');
    }

    return admin;
  }

  /**
   * Get current user info
   */
  async getMe(userId: string) {
    return this.prisma.adminUser.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        lastLoginAt: true,
      },
    });
  }
}
