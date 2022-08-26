import 'mgl/util'
import { prepare } from 'mgl/data'
import { WGL } from 'wgl'

const
	el = select('canvas')!,
	gl = new WGL(el),
	sl = await fetchText('/sample.glsl'),
	gd = await fetchData('/states.json') as Ɐ,
	{ triangles, lines } = prepare(gd, gd.objects.country),
	{ grid } = gl.programs(sl),
	title = document.title

let
	dragging: ꭖ[] = null,
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
	mousedown: ({ clientX, clientY }) => dragging = [clientX, clientY, ...grid.uniforms.P],
	mouseup: () => dragging = null,
	mousemove: ({ clientX, clientY }) => {
		if (!dragging) return

		const
			[x, y, X, Y] = dragging,
			scale = 500

		grid.uniforms.P = [X + (x - clientX) / -scale, Y + (y - clientY) / scale]
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
	},
	load: () => {
		if (grid) {
		}
		else {
			debugger
		}
	},
	beforeunload: () => {
		localStorage.setItem('uniforms', JSON.stringify(grid.uniforms))
	}
})

Object.assign(
	grid.uniforms,
	{ Z: .5, P: [0, 0] },
	JSON.parse(localStorage.getItem('uniforms')),
)

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

function fps() {
	document.title = `${title} - ${frame}`
	frame = 0
}

gl.context.lineWidth(1)
grid.data([...triangles, ...lines], 2)

trigger('resize')
next(draw)
fps.every(1)

Object.assign(window, { gd })