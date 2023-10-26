uniform float uTime;
uniform float progress;
uniform vec2 uOffset;
uniform vec4 uResolution;

varying vec2 vUv;
varying vec3 vPosition;

float PI = 3.141592653589793238;
void main()	{

	// float strength =  1.0 - distance(vUv, vec2(0.5));

	// float strength =  0.025 / distance(vUv, vec2(0.5));

	float distanceToCenter = distance(vUv, vec2(0.5));
    float strength = 0.03 / distanceToCenter - 0.05 * 2.0;


	gl_FragColor = vec4(1.0, 1.0, 1.0, strength );
}