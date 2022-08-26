import { earcut } from 'wgl'
import { mesh } from 'geo'

function* stich(a) {
	let i = 0
	while (i < a.length - 1) {
		yield a[i]
		yield a[i + 1]
		yield a[i + 2]
		yield a[i + 3]
		i += 2
	}
}

export function prepare(topo, target) {
	let
		triangles = [], lines = [],
		geometries = target.geometries

	for (const feature of geometries) {
		target.geometries = [feature]

		for (const coords of mesh(topo, target).coordinates) {
			const
				{ vertices, holes, dimensions } = earcut.flatten([coords]),
				indexes = earcut(vertices, holes, dimensions),
				result = indexes.map(i => [vertices[i * 2], (vertices[i * 2 + 1])]).flat(2)
			triangles = triangles.concat(result)
			lines = lines.concat(Array.from(stich(vertices)))
		}
	}

	return { triangles, lines }
}