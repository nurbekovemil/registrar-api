import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { User } from "../users/entities/users.entity";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService
  ) {}

/**
 * The login function asynchronously validates a user and generates a token.
 * @param {LoginDto} loginDto - The `loginDto` parameter likely represents an object containing the
 * data needed for user login, such as username and password. It is commonly used to pass user
 * credentials for authentication purposes.
 * @returns The `login` method is returning the result of calling the `generateToken` method with the
 * `user` object as its argument.
 */
  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto);
    const token = this.generateToken(user)
    return {
      user,
      token
    };
  }

  async auth(user) {
    return this.generateToken(user);
  }

  private async generateToken(user: User) {
    const payload = { login: user.login, id: user.id };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  private async validateUser(loginDto: LoginDto) {
    const user = await this.userService.getUserByLogin(loginDto.login);
    const passwordEquals = await bcrypt.compare(
      loginDto.password,
      user.password
    );
    if (user && passwordEquals) {
      return user;
    }
    throw new UnauthorizedException({
      message: "Неправильный логин или пароль",
    });
  }
}
