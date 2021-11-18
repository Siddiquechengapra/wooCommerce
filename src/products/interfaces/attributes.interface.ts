export interface Terms {
	id: number
	name: string
	slug: string
}

export interface Attributes {
	id: number
	name: string
	slug: string
	terms: Terms[]
}
