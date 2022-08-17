import '@topojson-client'
import { meshArcs } from '#topojson-client'
console.log(meshArcs)

import 'mgl/util'
import WGL from 'wgl'

const
	host = select('canvas')!,
	wglc = new WGL(host),
	glsl = await fetchText('sample.glsl'),
	{ grid } = wglc.programs(glsl)

let
	paused = false,
	last = now(),
	frame = 0

each({
	//mousemove: () => { },
	//click: () => { },
	resize: () => {
		const { innerWidth: w, innerHeight: h } = window
		grid.uniforms.R = [w, h]
	},
	focus: () => {
		paused = false
		console.log('focus')
	},
	blur: () => {
		paused = true
		console.log('blur')
	}
}, (fn, ev) => window.addEventListener(ev, fn))

function draw() {
	if (paused)
		return draw.after(.3)

	const delta = now() - last
	if (delta > 1000 / 30) {
		last += delta
		grid.uniforms.T = last
		grid.uniforms.F = ++frame
		grid.draw()
	}

	next(draw)
}

function fps() {
	document.title = frame.toString()
	frame = 0
}

trigger('resize')

wglc.quad()
next(draw)
fps.every(1)
