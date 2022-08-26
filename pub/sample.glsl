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
uniform int F;

void main() {
	if(F == 1) {
		C = vec4(.1, 0.1, 0.1, 1.);
	} else {
		C = vec4(0.3, 0.3, 0.3, 1.);
		C *= (sin(P.x + P.y) + 1.) / 4.;
	}

	C.r += T * .000001;
	C.r += R.x * .000001;
}