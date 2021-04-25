import { Body, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/users.model';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private usersService: UsersService,
    ) {}
    async login(@Body() dto: CreateUserDto) {
        const user = await this.validateUser(dto);
        return this.genToken(user);
    }

    private async genToken(user: User) {
        const payload = { email: user.email, id: user.id, roles: user.roles };
        return { token: this.jwtService.sign(payload) };
    }

    private async validateUser(dto: CreateUserDto) {
        const user = await this.usersService.getUserByEmail(dto.email);
        const comparePassword = await bcrypt.compare(
            dto.password,
            user.password,
        );
        if (user && comparePassword) {
            return user;
        }
        throw new UnauthorizedException({
            message: 'Некорректный email или пароль',
        });
    }

    async getUserByToken(token: string, dto: CreateUserDto): Promise<User> {
        const user = await this.jwtService.decode(token);
        const res = await this.usersService.getUserByEmail('user1@gmail.com');
        return res;
    }
}
