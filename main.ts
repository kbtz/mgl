import 'mgl/util'
import { WGL, earcut } from 'wgl'

const
	el = select('canvas')!,
	gl = new WGL(el),
	sl = await fetchText('/sample.glsl'),
	gd = await fetchData('/states.json') as Ɐ,
	{ grid } = gl.programs(sl)

let
	paused = false,
	dragging: ԗ = null,
	last = now(),
	frame = 0

const { TRIANGLES, LINE_STRIP } = WebGL2RenderingContext

listen({
	wheel: ({ deltaY }) => {
		grid.uniforms.Z += .05 * Math.sign(deltaY)
	},
	click: () => {
		grid.mode = grid.mode == TRIANGLES
			? LINE_STRIP
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
		console.log(grid.uniforms.P)
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
	if (delta > 1000 / 70) {
		last += delta
		frame++
		grid.uniforms.T = last
		grid.draw()
	}

	next(draw)
}

const title = document.title
function fps() {
	document.title = `${title} - ${frame}`
	frame = 0
}

import { mesh } from 'geo'

let
	triangles = [],
	target = gd.objects.state,
	geometries = target.geometries

for (const feature of geometries) {
	target.geometries = [feature]

	for (const coords of mesh(gd, target).coordinates) {
		const
			{ vertices, holes, dimensions } = earcut.flatten([coords]),
			indexes = earcut(vertices, holes, dimensions),
			result = indexes.map(i => [vertices[i * 2], (vertices[i * 2 + 1])]).flat(2)
		triangles = triangles.concat(result)
	}

}
grid.uniforms.Z = .5
grid.uniforms.P = [0, 0]
grid.mode = TRIANGLES
grid.data(triangles, 2)

trigger('resize')
next(draw)
fps.every(1)

Object.assign(window, { gd })