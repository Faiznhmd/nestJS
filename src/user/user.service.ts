import { ConflictException, Injectable } from '@nestjs/common';
import { RegisterDto } from 'src/auth/dto/register.user.dto';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async user(registerDto: RegisterDto) {
    try {
      return await this.userModel.create({
        fname: registerDto.fname,
        lname: registerDto.lname,
        email: registerDto.email,
        password: registerDto.password,
      });
    } catch (err: unknown) {
      console.log(err);
      const e = err as { code?: number };
      const DUPLICATE_KEY_CODE = 11000;
      if (e.code === DUPLICATE_KEY_CODE) {
        throw new ConflictException('Email is already Taken');
      }
      throw err;
    }
  }
}
