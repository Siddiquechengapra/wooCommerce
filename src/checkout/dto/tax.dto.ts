import { ArrayMinSize, IsBoolean, IsNumber, IsString, ValidateNested } from "class-validator"
import { Type } from "class-transformer"

export class TaxProduct {
	@IsString()
	product_id: string

	@IsString()
	variant_id: string

	@IsNumber()
	qty: number
}

export class TaxLocation {
	@IsString()
	postcode: string

	@IsString()
	city: string

	@IsString()
	state_code: string

	@IsString()
	country_code: string
}
export class TaxDto {
	@IsNumber()
	customer_id: number

	@IsBoolean()
	use_location: boolean

	@ValidateNested({ each: true })
	@ArrayMinSize(1)
	@Type(() => TaxProduct)
	products: TaxProduct[]

	@ValidateNested({ each: true })
	@Type(() => TaxLocation)
	location: TaxLocation
}
