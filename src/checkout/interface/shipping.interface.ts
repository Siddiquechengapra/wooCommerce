export interface ShippingMethod {
	id: string
	enabled: string
	method_id: string
	method_title: string
	settings: {
		label: string
		value: string
		options: string
	}
}
