import { Injectable } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Document } from './entities/document.entity';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(Document) private documentRepository: typeof Document,
  ){}
  async createDocument(createDocumentDto: CreateDocumentDto) {
    const document = await this.documentRepository.create(createDocumentDto);
    return document
  }

  async updateDocument(id: number, updateDocumentDto: UpdateDocumentDto) {
    let document = await this.documentRepository.findByPk(id);
    document.title = updateDocumentDto.title
    await document.save()
    return document
  }

  async getDocuments(eid) {
    const documents = await this.documentRepository.findAll({
      where: {
        emitent_id: eid
      }
    })
    return documents
  }

  async getDocumentById(id: number) {
    const document = await this.documentRepository.findByPk(id)
    return document
  }
}
