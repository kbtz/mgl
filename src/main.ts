import { WGL } from './util'

const
	host = select('canvas')!,
	wglc = new WGL(host),
	glsl = await fetchText('sample.glsl'),
	{ grid } = wglc.parse(glsl)

let frame = 0, last = now(), paused = false

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
