export class CreateSecurityDto {
    readonly type_id: number;
    readonly status_id: number;
    readonly attitude_id: number;
    readonly holder_id: number;
    readonly emitent_id: number;
    readonly emission_id: number;
    readonly quantity: number;
    readonly purchased_date: string
}
