attribute vec3 vertPos;
attribute vec4 vertColor;

uniform mat4 projMat;
uniform mat4 mvMat;

varying lowp vec4 fragVertColor;

void main() {
  vec4 mvPos = mvMat * vec4(vertPos, 1.0);
  gl_Position = projMat * mvPos;
  fragVertColor = vertColor;
}