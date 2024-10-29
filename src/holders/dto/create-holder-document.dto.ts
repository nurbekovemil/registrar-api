import { CreateHolderDto } from "./create-holder.dto";

export class CreateDocumentDto {
    readonly title: string;
    readonly emitent_id: number;
    readonly holder_id: number;
    readonly provider_name: string;
    readonly signer_name: string;
    readonly receipt_date: Date;
    readonly sending_date: Date;
    readonly sending_address: string;
    readonly reponse_number: number;
}

export class CreateHolderDocumentDto {
    holder_data: CreateHolderDto
    holder_document: CreateDocumentDto
}
