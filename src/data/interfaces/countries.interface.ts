export interface StateT {
	code: String
	name: String
}

export interface CountryListT {
	code: String
	name: String
	states: StateT[]
}

export interface CountryResponseT {
	countries: CountryListT
}