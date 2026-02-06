import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/register.user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async registerUser(registerDto: RegisterDto) {
    // console.log('register', registerDto);

    const saltRound = 10;
    const hash = await bcrypt.hash(registerDto.password, saltRound);
    const user = await this.userService.user({
      ...registerDto,
      password: hash,
    });

    const payLoad = { sub: user._id };
    const token = await this.jwtService.signAsync(payLoad);
    console.log(token);

    return { access_token: token };
  }
}
