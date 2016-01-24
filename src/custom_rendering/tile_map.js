flatsim.TileMap = function (gl) {
  this.gl = gl;

  // TODO don't hardcode verts
  var testZ = 0;
  var farScale = 1;
  this.vert_buffer = new flatsim.ArrayBuffer(gl, [
    -1,  1,  testZ, // tlnear 0
    -1, -1,  testZ, // blnear 1
     1, -1,  testZ, // brnear 2
     1,  1,  testZ, // trnear 3

     -farScale,  farScale, testZ - (2 * farScale), // tlfar 4
     -farScale, -farScale, testZ - (2 * farScale), // blfar 5
     farScale,  farScale, testZ - (2 * farScale), // trfar 6
     farScale, -farScale, testZ - (2 * farScale), // brfar 7
  ]);
  // TODO don't hardcode faces
  this.face_buffer = new flatsim.ArrayBuffer(gl, [
    0, 1, 2, // tln-bln-brn
    2, 3, 0, // brn-trn-tln

    4, 5, 1, // tlf-blf-bln
    1, 0, 4, // bln-tln-tlf

    3, 2, 7, // trn-brn-brf
    7, 6, 3, // brf-trf-trn
  ], this.gl.ELEMENT_ARRAY_BUFFER);

  // TODO don't hardcode vert colors
  this.color_buffer = new flatsim.ArrayBuffer(gl, [
    0.0, 1.0, 0.0, 1.0, // tlnear 0
    0.0, 1.0, 0.0, 1.0, // blnear 1
    0.0, 1.0, 0.0, 1.0, // brnear 2
    0.0, 1.0, 0.0, 1.0, // trnear 3

    0.0, 1.0, 0.0, 1.0, // tlfar 4
    0.0, 1.0, 0.0, 1.0, // blfar 5

    0.0, 1.0, 0.0, 1.0, // brfar 6
    0.0, 1.0, 0.0, 1.0, // trfar 7
  ], gl.ARRAY_BUFFER, 4);

  this.face_norms = this.calculate_face_normals();
  var norms = this.calculate_vert_normals(this.face_norms);
  this.norm_buffer = new flatsim.ArrayBuffer(gl, norms);

  this.renderer = new flatsim.TileBufferRenderer(gl);
};
flatsim.TileMap.prototype = {
  gl: null,

  vert_buffer: null,
  face_buffer: null,
  norm_buffer: null,
  color_buffer: null,

  face_norms: null,

  renderer: null,

  update: function () {
    // this.vert_buffer.update();
    // this.face_buffer.update();
  },

  draw: function () {
    this.renderer.draw(this.vert_buffer, this.face_buffer, this.norm_buffer, this.color_buffer);
  },

  calculate_face_normals: function () {
    var face, vertA, vertB, vertC, edgeBA, edgeCA;
    var faceNormalsByVert = {};
    var faceNormalsByFace = [];
    var faceIxByVert = {};
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
      faceNormalsByFace.push(edgeBA);
      _.forEach(face, function (vertIx) {
        if (typeof faceNormalsByVert[vertIx] === 'undefined') {
          faceNormalsByVert[vertIx] = [];
          faceIxByVert[vertIx] = [];
        }
        faceNormalsByVert[vertIx].push(edgeBA);
        faceIxByVert[vertIx].push(i);
      });
    }
    return {
      by_vert: faceNormalsByVert,
      by_face: faceNormalsByFace,
      ix_by_vert: faceIxByVert
    };
  },

  calculate_vert_face_weights: function (vertIx, faceIxs) {
    var vertBuff = this.vert_buffer;
    var faceBuff = this.face_buffer;
    var center = vertBuff.get(vertIx);
    var weights = [];
    _.forEach(faceIxs, function (faceIx) {
      var face = faceBuff.get(faceIx);
      var vertA, vertB;
      var weight;
      if (face[0] === vertIx) {
        vertA = vertBuff.get(face[1]);
        vertB = vertBuff.get(face[2]);
      } else if (face[1] === vertIx ){
        vertA = vertBuff.get(face[0]);
        vertB = vertBuff.get(face[2]);
      } else { // face[2] === vertIx
        vertA = vertBuff.get(face[0]);
        vertB = vertBuff.get(face[1]);
      }
      vertA = vec3.sub(vertA, vertA, center);
      vertB = vec3.sub(vertB, vertB, center);
      vec3.normalize(vertA, vertA);
      vec3.normalize(vertB, vertB);
      weight = Math.abs(Math.acos(vec3.dot(vertA, vertB)));
      weights.push(weight);
    });
    var weightSum = _.sum(weights);
    var faceIx;
    _.forEach(weights, function(weight, i){
      weights[i] = weight / weightSum;
    });
    return weights;
  },

  calculate_vert_normals: function (faceInfo) {
    var faceNorms = faceInfo.by_vert;
    var faceIxs = faceInfo.ix_by_vert;
    var i, j;
    var vertFaceNorms, vertFaceWeights, vecNorm, curVec;
    var vertNorms = [];
    for (i = 0; i < this.vert_buffer.get_element_count(); i++) {
      vertFaceNorms = faceNorms[i];
      vertFaceWeights = this.calculate_vert_face_weights(i, faceIxs[i]);
      vecNorm = [0, 0, 0];
      for (j = 0; j < vertFaceNorms.length; j++) {
        curVec = vec3.create();
        vec3.scale(curVec, vertFaceNorms[j], vertFaceWeights[j]);
        vec3.add(vecNorm, vecNorm, curVec);
      }
      vec3.normalize(vecNorm, vecNorm);
      vertNorms = vertNorms.concat(vecNorm);
    }
    return vertNorms;
  },

  toString: function () {
    var str = 'TileMap\n\nface info:';
    var i;
    var face, fNorm, vertA, vertB, vertC, vANorm, vBNorm, vCNorm;
    for (i = 0; i < this.face_buffer.get_element_count(); i++) {
      face = this.face_buffer.get(i);
      fNorm = this.face_norms.by_face[i];
      vertA = this.vert_buffer.get(face[0]);
      vertB = this.vert_buffer.get(face[1]);
      vertC = this.vert_buffer.get(face[2]);
      vANorm = this.norm_buffer.get(face[0]);
      vBNorm = this.norm_buffer.get(face[1]);
      vCNorm = this.norm_buffer.get(face[2]);

      str += '\n=======================================';
      str += flatsim.util.format_string('\nface: {0}, {1}, {2}', face[0], face[1], face[2]);
      str += flatsim.util.format_string('\nnorm: {0}, {1}, {2}', fNorm[0], fNorm[1], fNorm[2]);
      str += '\n---------------------------------------';
      str += flatsim.util.format_string('\nvert {3}: {0}, {1}, {2}', vertA[0], vertA[1], vertA[2], face[0]);
      str += flatsim.util.format_string('\nnorm {3}: {0}, {1}, {2}', vANorm[0], vANorm[1], vANorm[2], face[0]);
      str += '\n---------------------------------------';
      str += flatsim.util.format_string('\nvert {3}: {0}, {1}, {2}', vertB[0], vertB[1], vertB[2], face[1]);
      str += flatsim.util.format_string('\nnorm {3}: {0}, {1}, {2}', vBNorm[0], vBNorm[1], vBNorm[2], face[1]);
      str += '\n---------------------------------------';
      str += flatsim.util.format_string('\nvert {3}: {0}, {1}, {2}', vertC[0], vertC[1], vertC[2], face[2]);
      str += flatsim.util.format_string('\nnorm {3}: {0}, {1}, {2}', vCNorm[0], vCNorm[1], vCNorm[2], face[2]);
      str += '\n=======================================';
    }

    var vertIx, vert, faceArr;
    str += '\n\nface normals by vert:';
    for (vertIx in this.face_norms.by_vert) {
      faceArr = this.face_norms.by_vert[vertIx];
      vert = this.vert_buffer.get(vertIx);
      str += '\n=======================================';
      str += flatsim.util.format_string('\nvert {3}: {0}, {1}, {2}', vert[0], vert[1], vert[2], vertIx);;
      str += '\nfaces:';
      for (i = 0; i < faceArr.length; i++) {
        face = faceArr[i];
        str += flatsim.util.format_string('\n{0}, {1}, {2}', face[0], face[1], face[2]);
        if (i < faceArr.length - 1) {
          str += '\n---------------------------------------';
        }
      }
    }

    return str;
  }
};
