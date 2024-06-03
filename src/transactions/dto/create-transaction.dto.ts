export class CreateTransactionDto {
    readonly is_exchange: boolean;
    readonly operation_id: number;
    readonly emitent_id: number;
    readonly emission_id: number;
    readonly holder_from_id?: number;
    readonly holder_to_id: number;
    readonly is_family: boolean;
    readonly quantity: number;
    readonly amount: number;
    readonly contract_date: string;
}
