import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { CreateAccountTypeDto } from './dto/create-type-account.dto';
import { UpdateAccountTypeDto } from './dto/update-type-account.dto';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  createAccount(@Body() createAccountDto: CreateAccountDto) {
    return this.accountsService.createAccount(createAccountDto);
  }

  @Get()
  findAllAccount() {
    return this.accountsService.findAllAccount();
  }

  @Get(':id')
  findOneAccount(@Param('id') id: number) {
    return this.accountsService.findOneAccount(id);
  }

  @Patch(':id')
  updateAccount(@Param('id') id: number, @Body() updateAccountDto: UpdateAccountDto) {
    return this.accountsService.updateAccount(id, updateAccountDto);
  }

  @Delete(':id')
  removeAccount(@Param('id') id: number) {
    return this.accountsService.removeAccount(id);
  }

  // AccountType controller

  @Post('type')
  createAccountType(@Body() createAccountTypeDto: CreateAccountTypeDto) {
    return this.accountsService.createAccountType(createAccountTypeDto);
  }

  @Get('type')
  findAllAccountType() {
    return this.accountsService.findAllAccountType();
  }

  @Get('type/:id')
  findOneAccountType(@Param('id') id: number) {
    return this.accountsService.findOneAccountType(id);
  }

  @Patch('type/:id')
  updateAccountType(@Param('id') id: number, @Body() updateAccountTypeDto: UpdateAccountTypeDto) {
    return this.accountsService.updateAccountType(id, updateAccountTypeDto);
  }

  @Delete('type/:id')
  removeAccountType(@Param('id') id: number) {
    return this.accountsService.removeAccountType(id);
  }

}
