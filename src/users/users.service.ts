import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { User } from "./entities/users.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { InjectModel } from "@nestjs/sequelize";
import * as bcrypt from "bcryptjs";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
  ) {}

  async createUser(dto: CreateUserDto) {
    try {
      const candidate = await this.userRepository.findOne({ where: { login: dto.login } });
      if (candidate) {
        throw new Error('Пользователь с таким логином уже существует');
      }
      const hashPassword = await bcrypt.hash(dto.password, 5)
      const user = await this.userRepository.create({...dto, password: hashPassword});
      return user; 
    } catch (error) {
      throw new HttpException(
        error.message,
        HttpStatus.BAD_REQUEST,
      )
    }
  }

  async getAllUsers() {
    const users = await this.userRepository.findAll({ include: { all: true } });
    return users;
  }

  async getUserByLogin(login: string) {
    const user = await this.userRepository.findOne({
      where: { login },
      include: { all: true },
    });
    return user
  }

  async getUserByPk(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      include: { all: true },
    });
    return user
  }
}
