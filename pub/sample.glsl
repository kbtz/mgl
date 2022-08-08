///F/grid
#define C gl_FragColor 
#define P gl_FragCoord 

uniform vec2 R;
uniform float T;
uniform float F;

void main() {
	vec2 p = P.xy / R;
	float t = T / 1000.;
	float f = F / 1000.;
	C = vec4(p.x * p.y, p.x * cos(t) + p.y * sin(f), p.y * sin(t - cos(p.x - t)), 1.);
}
