import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcryptjs';
import { User } from './users.model';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User) private userRepository: typeof User,
        private rolesService: RolesService,
    ) {}

    async createUser(dto: CreateUserDto): Promise<User> {
        /*const user = await this.userRepository.create(dto);
        const role = await this.rolesService.getRoleByValue('USER');
        await user.$set('roles', [role.id]);
        user.roles = [role];
        return user;*/
        const candidate = await this.getUserByEmail(dto.email);
        if (candidate) {
            throw new HttpException(
                'Пользователь с таким email уже существует',
                HttpStatus.BAD_REQUEST,
            );
        }
        const hashPasword = await bcrypt.hash(dto.password, 6);
        const user = await this.userRepository.create({
            ...dto,
            password: hashPasword,
        });
        return user;
    }

    async getAllUsers(): Promise<User[]> {
        const users = await this.userRepository.findAll({
            include: { all: true },
        });
        return users;
    }

    async getUserByEmail(email: string): Promise<User> {
        const user = await this.userRepository.findOne({
            where: { email },
            include: { all: true },
        });
        return user;
    }
}
