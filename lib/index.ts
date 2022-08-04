import '@kbtz/hax/maps'
import '@kbtz/hax/time'
import '@kbtz/hax/merge'
import '@kbtz/hax/dom'

import { feature } from 'topojson-client'
import { WGL } from '@kbtz/wgl'

export { feature, WGL }

window[ͼ] = {
	next: requestAnimationFrame,
	now: performance.now.bind(performance),
}

declare global {
	const now: typeof performance.now
	const next: typeof requestAnimationFrame
}
