import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User) private userModel: typeof User) {}

    async findByEmail(email: string): Promise<User | null> {
        return this.userModel.findOne({ where: { email } });
    }

    async createUser(email: string, password: string): Promise<User> {
        const hashed = await bcrypt.hash(password, 10);
        return this.userModel.create({ email, password: hashed });
    }

    async findById(id: string): Promise<User | null> {
        return this.userModel.findByPk(id);
    }

    getAllUsers() {
        return this.userModel.findAll();
    }
}
