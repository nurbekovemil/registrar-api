import { Injectable } from "@nestjs/common";
import { User } from "./entities/users.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { InjectModel } from "@nestjs/sequelize";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
  ) {}

  async createUser(dto: CreateUserDto) {
    const user = await this.userRepository.create(dto);
    return user;
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
