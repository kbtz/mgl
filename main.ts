import 'mgl/util'
import 'npm/vite-tsconfig-paths'
import { WGL } from 'wgl'

//import { feature, patterson } from 'geo'
//console.log(feature)
//debugger


const
	el = select('canvas')!,
	gl = new WGL(el),
	sl = await fetchText('sample.glsl'),
	gd = await fetchData('states.json'),
	{ grid } = gl.programs(sl)


let
	paused = false,
	last = now(),
	frame = 0

listen({
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
})

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

const title = document.title
function fps() {
	document.title = `${title} - ${frame}`
	frame = 0
}

trigger('resize')

gl.quad()
next(draw)
fps.every(1)
