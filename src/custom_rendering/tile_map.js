flatsim.TileMap = function (gl) {
  this.gl = gl;

  // TODO don't hardcode verts
  var testZ = 0;
  var farScale = 2;
  this.vert_buffer = new flatsim.ArrayBuffer(gl, [
    -1,  1,  testZ, // tlnear 0
    -1, -1,  testZ, // blnear 1
     1, -1,  testZ, // brnear 2
     1,  1,  testZ,  // trnear 3

     -farScale,  farScale, testZ - (2 * farScale), // tlfar 4
     -farScale, -farScale, testZ - (2 * farScale), // blfar 5
     farScale,  farScale, testZ - (2 * farScale), // trfar 6
     farScale, -farScale, testZ - (2 * farScale), // brfar 7
  ]);
  // TODO don't hardcode faces
  this.face_buffer = new flatsim.ArrayBuffer(gl, [
    0, 1, 2, // tln-bln-brn
    0, 2, 3, // tln-brn-trn

    4, 5, 0, // tlf-blf-tln
    0, 5, 1, // tln-blf-bln

    3, 7, 6, // trn-brf-trf
    3, 2, 7, // trn-brn-brf
  ], this.gl.ELEMENT_ARRAY_BUFFER);

  var norms = this.calculate_face_normals();
  norms = this.calculate_vert_normals(norms);
  this.norm_buffer = new flatsim.ArrayBuffer(gl, norms);

  this.renderer = new flatsim.TileBufferRenderer(gl);
};
flatsim.TileMap.prototype = {
  gl: null,
  vert_buffer: null,
  face_buffer: null,
  norm_buffer: null,

  renderer: null,

  update: function () {
    // this.vert_buffer.update();
    // this.face_buffer.update();
  },

  draw: function () {
    this.renderer.draw(this.vert_buffer, this.face_buffer, this.norm_buffer);
  },

  calculate_face_normals: function () {
    var face, vertA, vertB, vertC, edgeBA, edgeCA;
    var faceNorms = {};
    var i;
    for (i = 0; i < this.face_buffer.get_element_count(); i++) {
      face = this.face_buffer.get(i);
      vertA = this.vert_buffer.get(face[0]);
      vertB = this.vert_buffer.get(face[1]);
      vertC = this.vert_buffer.get(face[2]);
      edgeBA = vec3.create();
      edgeCA = vec3.create();
      vec3.sub(edgeBA, vertB, vertA);
      vec3.sub(edgeCA, vertC, vertA);
      vec3.cross(edgeBA, edgeBA, edgeCA)
      vec3.normalize(edgeBA, edgeBA);
      // norms = flatsim.wgl_utils.merge_float32_arrays(norms, edgeBA);
      _.forEach(face, function (vertIx) {
        if (typeof faceNorms[vertIx] === 'undefined') {
          faceNorms[vertIx] = [];
        }
        faceNorms[vertIx].push(edgeBA);
      });
    }
    return faceNorms;
  },

  calculate_vert_normals: function (faceNorms) {
    var i, j;
    var vertFaceNorms, vecNorm;
    var vertNorms = [];
    for (i = 0; i < this.vert_buffer.get_element_count(); i++) {
      vertFaceNorms = faceNorms[i];
      vecNorm = [0, 0, 0];
      for (j = 0; j < vertFaceNorms.length; j++) {
        vec3.add(vecNorm, vecNorm, vertFaceNorms[j]);
      }
      vec3.normalize(vecNorm, vecNorm);
      vertNorms = vertNorms.concat(vecNorm);
    }
    return vertNorms;
  },
};
