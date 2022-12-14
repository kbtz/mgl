import 'hax/full'
import 'hax/type'

Object.assign(window, {
	now: performance.now.bind(performance),
	next: requestAnimationFrame
})

declare global {
	const now: typeof performance.now
	const next: typeof requestAnimationFrame
}