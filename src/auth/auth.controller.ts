import {
    Body,
    Controller,
    Get,
    Headers,
    HttpCode,
    HttpStatus,
    Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { STATUS_CODES } from 'http';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/login')
    login(@Body() dto: CreateUserDto) {
        return this.authService.login(dto);
    }

    @Post('/logout')
    logOut(): number {
        return HttpStatus.ACCEPTED;
    }

    @Get('user')
    getUserByToken(
        @Headers('Authorization') token: string,
        dto: CreateUserDto,
    ) {
        return this.authService.getUserByToken(token, dto);
    }
}
