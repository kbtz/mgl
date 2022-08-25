///V/grid
attribute vec2 pos;

uniform float Z;
uniform vec2 P;

vec2 naturalEarth1(float lon, float lat) {
	float lambda = radians(lon);
	float phi = radians(lat);
	float phi2 = phi * phi;
	float phi4 = phi2 * phi2;
	float x = lambda * (0.8707 - 0.131979 * phi2 + phi4 * (-0.013791 + phi4 * (0.003971 * phi2 - 0.001529 * phi4)));
	float y = phi * (1.007226 + phi2 * (0.015085 + phi4 * (-0.044475 + 0.028874 * phi2 - 0.005916 * phi4)));
	return vec2(x, y);
}

vec2 equirectangular(float lon, float lat) {
	float lambda = radians(lon);
	float phi = radians(lat);
	return vec2(cos(phi) * sin(lambda), sin(phi));
}

void main() {
	vec2 p = naturalEarth1(pos.x, pos.y) * Z;
	p += P;
	//vec2 p = equirectangular(pos.x, pos.y);
	//vec2 p = pos;
	gl_Position = vec4(p, 0., 1.);
}

///F/grid
#define C gl_FragColor 
#define P gl_FragCoord

uniform float T;
uniform vec2 R;

float rand(vec2 n) {
	return fract(sin(dot(n, vec2(12.9898, 12.1414))) * 83758.5453);
}

float noise(vec2 n) {
	const vec2 d = vec2(0.0, 1.0);
	vec2 b = floor(n);
	vec2 f = mix(vec2(0.0), vec2(1.0), fract(n));
	return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
}

vec3 ramp(float t) {
	return t <= .5 ? vec3(1. - t * 1.4, .2, 1.05) / t : vec3(.3 * (1. - t) * 2., .2, 1.05) / t;
}

float fire(vec2 n) {
	return noise(n) + noise(n * 2.1) * .6 + noise(n * 5.4) * .42;
}

void main() {
	float t = T;
	vec2 uv = P.xy / R.y;

	uv.x += uv.y < .5 ? 23.0 + t * .35 : -11.0 + t * .3;
	uv.y = abs(uv.y - .5);
	uv *= 5.0;

	float q = fire(uv - t * .013) / 2.0;
	vec2 r = vec2(fire(uv + q / 2.0 + t - uv.x - uv.y), fire(uv + q - t));
	vec3 color = vec3(1.0 / (pow(vec3(0.5, 0.0, .1) + 1.61, vec3(4.0))));

	float grad = pow((r.y + r.y) * max(.0, uv.y) + .1, 4.0);
	color = ramp(grad);
	color /= (1.50 + max(vec3(0), color));
	C = vec4(color, 1.0);
}
