import { ReviewService } from "./review.service"
import { ReviewController } from "./review.controller"
import { Module } from "@nestjs/common"
import { UtilsModule } from "src/utils/utils.module"

@Module({
	imports: [UtilsModule],
	controllers: [ReviewController],
	providers: [ReviewService]
})
export class ReviewModule {}
