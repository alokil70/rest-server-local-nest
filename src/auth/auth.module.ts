import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';

@Module({
    controllers: [AuthController],
    providers: [AuthService],
    imports: [
        JwtModule.register({
            secret: process.env.PRIVATE_KEY || 'dedededefef',
            signOptions: {
                expiresIn: '24h',
            },
        }),
        forwardRef(() => UsersModule),
    ],
    exports: [JwtModule],
})
export class AuthModule {}
