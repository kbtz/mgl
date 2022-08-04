declare module "*?raw" {
	const content: string
	export default content
}

declare module "+*" {
	const content: string
	export default content
}