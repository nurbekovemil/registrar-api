export class CreateEmissionDto {
    readonly reg_number: string;
    readonly release_date: number;
    readonly start_nominal: number;
    readonly new_nominal: number;
    readonly start_count: number;
    readonly new_count: number;
    readonly splitting: number;  
}
