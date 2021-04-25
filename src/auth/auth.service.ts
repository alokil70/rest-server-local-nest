import {
    Body,
    HttpException,
    HttpStatus,
    Injectable,
    Post,
    UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/users.model';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}
    async login(@Body() dto: CreateUserDto) {
        const user = await this.validateUser(dto);
        return this.genToken(user);
    }

    async registration(@Body() dto: CreateUserDto) {
        const candidate = await this.usersService.getUserByEmail(dto.email);
        if (candidate) {
            throw new HttpException('email занят', HttpStatus.BAD_REQUEST);
        }
        const hashPasword = await bcrypt.hash(dto.password, 6);
        const user = await this.usersService.createUser({
            ...dto,
            password: hashPasword,
        });
        console.log(this.genToken(user));
        return user;
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
}
