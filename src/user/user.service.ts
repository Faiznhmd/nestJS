import { ConflictException, Injectable } from '@nestjs/common';
import { RegisterDto } from 'src/auth/dto/register.user.dto';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  // ================= CREATE USER =================
  async createUser(registerDto: RegisterDto) {
    try {
      return await this.userModel.create({
        fname: registerDto.fname,
        lname: registerDto.lname,
        email: registerDto.email,
        password: registerDto.password,
      });
    } catch (err: unknown) {
      const e = err as { code?: number };
      if (e.code === 11000) {
        throw new ConflictException('Email is already taken');
      }
      throw err;
    }
  }

  // ================= FIND BY EMAIL =================
  async findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }
}
