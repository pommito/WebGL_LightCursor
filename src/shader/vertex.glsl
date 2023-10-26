uniform float uTime;
uniform vec2 uOffset;

varying vec2 vUv;
varying vec3 vPosition;

float PI = 3.141592653589793238;

vec3 deformationCurve(vec3 position, vec2 uv, vec2 offset)
{
    position.x = position.x + (sin(uv.y * PI) * offset.x);
    position.y = position.y + (sin(uv.x * PI) * offset.y);
    return position;
}

void main() {
  vUv = uv;
  vec3 newPosition = deformationCurve(position, uv, uOffset);

  gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
}