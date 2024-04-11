import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Account } from './entities/account.entity';
import { AccountType } from './entities/account-type.entity';
import { CreateAccountTypeDto } from './dto/create-type-account.dto';
import { UpdateAccountTypeDto } from './dto/update-type-account.dto';

@Injectable()
export class AccountsService {
  constructor(
    @InjectModel(Account) private accountRepository: typeof Account,
    @InjectModel(AccountType) private accountTypeRepository: typeof AccountType
  ){}
  
  async createAccount(createAccountDto: CreateAccountDto) {
    const account = await this.accountRepository.create(createAccountDto)
    return account
  }

  async findAllAccount() {
    const accounts = await this.accountRepository.findAll()
    return accounts;
  }

  async findOneAccount(id: number) {
    const account = await this.accountRepository.findByPk(id)
    return account;
  }

  async updateAccount(id: number, updateAccountDto: UpdateAccountDto) {
    const account = await this.accountRepository.update(updateAccountDto, {
      where: {
        id
      }
    })
    return account;
  }

  async removeAccount(id: number) {
    const account = await this.accountRepository.destroy({where: {
      id
    }})
    return account;
  }

  // AccountType service

  async createAccountType(createAccountTypeDto: CreateAccountTypeDto) {
    const account = await this.accountTypeRepository.create(createAccountTypeDto)
    return account
  }

  async findAllAccountType() {
    const accounts = await this.accountTypeRepository.findAll()
    return accounts;
  }

  async findOneAccountType(id: number) {
    const account = await this.accountTypeRepository.findByPk(id)
    return account;
  }

  async updateAccountType(id: number, updateAccountTypeDto: UpdateAccountTypeDto) {
    const account = await this.accountTypeRepository.update(updateAccountTypeDto, {
      where: {
        id
      }
    })
    return account;
  }

  async removeAccountType(id: number) {
    const account = await this.accountTypeRepository.destroy({where: {
      id
    }})
    return account;
  }
}
