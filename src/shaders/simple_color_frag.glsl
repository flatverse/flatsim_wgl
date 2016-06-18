varying lowp vec4 fragVertColor;
varying lowp vec4 fragVertIx;

void main() {
  // adapted from http://codeflow.org/entries/2012/aug/02/easy-wireframe-display-with-barycentric-coordinates/
  if (any(lessThan(fragVertIx, vec4(0.02)))) {
    gl_FragColor = vec4(0, 0, 1, 1);
  } else {
    gl_FragColor = fragVertColor;
  }
}