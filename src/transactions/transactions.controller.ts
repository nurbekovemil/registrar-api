import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
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
  getTransaction(@Query() query: any) {
    return this.transactionsService.getTransactions(query);
  }
  @Get('/operations')
  getTransactionOperations() {
    return this.transactionsService.getTransactionOperations();
  }

  @Get('/:id')
  getTransactionById(@Param('id') id: number) {
    return this.transactionsService.getTransactionById(id);
  }

  @Get('/emitent/:id')
  getTransactionByEmitent(@Param('id') id: number, @Query() query: any) {
    return this.transactionsService.getTransactionByEmitent(id, query);
  }

}
