import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/register.user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  async registerUser(registerDto: RegisterDto) {
    // console.log('register', registerDto);

    const saltRound = 10;
    const hash = await bcrypt.hash(registerDto.password, saltRound);
    const user = await this.userService.user({
      ...registerDto,
      password: hash,
    });
    return user;
  }
}
