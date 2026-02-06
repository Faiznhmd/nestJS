import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
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

  // ================= REGISTER =================
  async registerUser(registerDto: RegisterDto) {
    const { email, password } = registerDto;

    // Check if user exists
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await this.userService.createUser({
      ...registerDto,
      password: hashedPassword,
    });

    // Generate token
    const payload = {
      sub: user._id.toString(),
      email: user.email,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      message: 'User registered successfully',
      access_token: token,
      user: {
        id: user._id,
        email: user.email,
        fname: user.fname,
        lname: user.lname,
      },
    };
  }

  // ================= VALIDATE =================
  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid email');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    return user;
  }

  // ================= LOGIN =================
  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);

    const payload = {
      sub: user._id.toString(),
      email: user.email,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      message: 'Login successful',
      access_token: token,
      user: {
        id: user._id,
        email: user.email,
        fname: user.fname,
        lname: user.lname,
      },
    };
  }
}
