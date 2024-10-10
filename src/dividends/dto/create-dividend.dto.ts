export class CreateDividendDto {
    readonly title: string
    readonly type: number
    readonly emitent_id: number
    readonly share_price: number
    readonly share_debited?: number
    readonly date_close_reestr: string
    readonly month_year: string
}
