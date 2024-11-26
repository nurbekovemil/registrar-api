import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}
  @Post('/create')
  createDocument(@Body() createDocumentDto: CreateDocumentDto) {
    return this.documentsService.createDocument(createDocumentDto)
  }

  @Get('/emitent/:id')
  getDocuments(@Param('id') id: number) {
    return this.documentsService.getDocuments(id)
  }

  @Get('/:id')
  getDocumentById(@Param('id') id: number) {
    return this.documentsService.getDocumentById(id)
  }

  @Put('/:id')
  updateDocument(@Param('id') id: number, @Body() updateDocumentDto: UpdateDocumentDto) {
    return this.documentsService.updateDocument(id, updateDocumentDto)
  }
}
