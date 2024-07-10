export class CreateEmissionDto {
    readonly reg_number: string;
    readonly release_date: string;
    readonly type_id: number;
    readonly emitent_id: number;
    readonly nominal: number;
    readonly start_count: number;
}
