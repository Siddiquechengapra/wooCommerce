export interface Widgets {
	widget_name: string
	position?: number
	config: Record<string, string | boolean | number>
	data?: Record<string, string | number | []>
}
export interface Config {
	version: string
	page_name: string
	store_id: string
	config: Record<string, string | boolean | number | []>
	data?: Record<string, string | number | []>
	header_widgets: Widgets[]
	scroll_widgets: Widgets[]
	footer_widgets: Widgets[]
}
