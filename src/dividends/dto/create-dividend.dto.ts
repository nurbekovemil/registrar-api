export class CreateDividendDto {
    readonly title: string
    readonly holder_type: number
    readonly emitent_id: number
    readonly share_price: number
    readonly share_debited?: number
    readonly date_payment: string
    readonly month_year: string
}
