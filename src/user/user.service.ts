import { Injectable } from '@nestjs/common';
import { RegisterDto } from 'src/auth/dto/register.user.dto';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async user(registerDto: RegisterDto) {
    return await this.userModel.create({
      fname: registerDto.fname,
      lname: registerDto.lname,
      email: registerDto.email,
      password: registerDto.password,
    });
  }
}
