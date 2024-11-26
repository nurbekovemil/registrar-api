export class CreateJournalDto {
    readonly title: string;
    readonly old_value: object;
    readonly new_value: object;
    readonly change_type: string;
    readonly changed_by: number;
}
