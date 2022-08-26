import 'mgl/util'
import { prepare } from 'mgl/data'
import { WGL } from 'wgl'

const
	el = select('canvas')!,
	gl = new WGL(el),
	sl = await fetchText('/sample.glsl'),
	gd = await fetchData('/states.json') as Ɐ,
	{ grid } = gl.programs(sl)

let
	triangles = [], lines = [],
	dragging: ԗ = null,
	paused = false,
	last = now(),
	frame = 0

const { TRIANGLES, LINES } = WebGL2RenderingContext

listen({
	wheel: ({ deltaY }) => {
		grid.uniforms.Z += .05 * Math.sign(deltaY)
	},
	click: () => {
		grid.mode = grid.mode == TRIANGLES
			? LINES
			: TRIANGLES
	},
	mousedown: ({ clientX, clientY }) => dragging = [clientX, clientY],
	mouseup: () => dragging = null,
	mousemove: ({ clientX, clientY }) => {
		if (!dragging) return
		const
			[x, y] = dragging,
			[X, Y] = grid.uniforms.P,
			scale = 500

		grid.uniforms.P = [(clientX - x) / scale, (clientY - y) / scale]
		//console.log(grid.uniforms.P)
	},
	resize: () => {
		Object.assign(el, el.size(true))
		grid.uniforms.R = el.size()
	},
	focus: () => {
		paused = false
		document.body.classList.remove('paused')
	},
	blur: () => {
		paused = true
		document.body.classList.add('paused')
	}
})

function draw() {
	if (paused)
		return draw.after(.3)

	const delta = now() - last
	if (delta > 1000 / 60) {
		last += delta
		frame++
		grid.uniforms.T = last / 1000

		grid.uniforms.F = '0'
		grid.mode = TRIANGLES
		grid.draw(0, triangles.length)

		grid.uniforms.F = '1'
		grid.mode = LINES
		grid.draw(triangles.length, lines.length)
	}

	next(draw)
	//paused = true
}

const
	title = document.title,
	data = prepare(gd, gd.objects.country)

triangles = data.triangles
lines = data.lines

function fps() {
	document.title = `${title} - ${frame}`
	frame = 0
}

grid.uniforms.Z = .5
grid.uniforms.P = [0, 0]

gl.context.lineWidth(1)
grid.data([...triangles, ...lines], 2)

trigger('resize')
next(draw)
fps.every(1)

Object.assign(window, { gd })