export interface CurrencyT {
	code: string
	name: string
	symbol: string
}

export interface CurrencyResponseT {
	currencies: CurrencyT
}