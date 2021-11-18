import { ArrayMinSize, IsString, ValidateNested } from "class-validator"
import { Type } from "class-transformer"

export class CartProduct {
	@IsString()
	product_id: string

	@IsString()
	variant_id: string
}
export class RefreshCartDto {
	@ValidateNested({ each: true })
	@ArrayMinSize(1)
	@Type(() => CartProduct)
	cart_products: CartProduct[]
}
