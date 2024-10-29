export class CreateHolderDto {
    readonly name: string;
    readonly actual_address: string;
    readonly legal_address: string;
    readonly phone_number: string;
    readonly passport_type: string;
    readonly passport_number: string;
    readonly passport_agency: string;
    readonly inn: string;
    readonly district_id: number;
    readonly holder_type: number;
}
