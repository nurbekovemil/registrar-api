import { Controller, Get, Post, Body } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  createTransaction(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.createTransaction(createTransactionDto);
  }

  @Get()
  getTransaction() {
    return this.transactionsService.getTransactions();
  }

  @Get('/operations')
  getTransactionOperations() {
    return this.transactionsService.getTransactionOperations();
  }
}
