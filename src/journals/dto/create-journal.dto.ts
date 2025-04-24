export class CreateJournalDto {
    readonly title: string;
    readonly old_value: object;
    readonly new_value: object;
    readonly change_type: string;
    readonly emitent_id: number[];
    readonly emission_id?: number;
    readonly document_id: number;
    readonly holder_id?: number;
    readonly org_emitent_id: number;
}
