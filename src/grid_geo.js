flatsim.GridGeo = function (args) {
  THREE.Geometry.call(this);
  _.extend(this, args);

  this.vertices = this._compute_verts();
  this.faces = this._make_faces();
  this.computeFaceNormals();
};
flatsim.GridGeo.prototype = Object.create(THREE.Geometry.prototype);
flatsim.GridGeo.prototype = _.extend(flatsim.GridGeo.prototype, {
  tl: undefined,
  tr: undefined,
  br: undefined,
  bl: undefined,
  line_width: 0.01,
  offset: new THREE.Vector3(0, 0, 0),

  vert_outter_tl: 0,
  vert_outter_tr: 1,
  vert_outter_br: 2,
  vert_outter_bl: 3,
  vert_inner_tl: 4,
  vert_inner_tr: 5,
  vert_inner_br: 6,
  vert_inner_bl: 7,

  _compute_verts: function() {
    var verts = [];
    verts[this.vert_outter_tl] = this.tl.clone().add(this.offset);
    verts[this.vert_outter_tr] = this.tr.clone().add(this.offset);
    verts[this.vert_outter_br] = this.br.clone().add(this.offset);
    verts[this.vert_outter_bl] = this.bl.clone().add(this.offset);

    var normTLTR = this.tr.clone().sub(this.tl).normalize();
    var normTLBL = this.bl.clone().sub(this.tl).normalize();

    var multTLTR = normTLTR.clone().multiplyScalar(this.line_width);
    var multTLBL = normTLBL.clone().multiplyScalar(this.line_width);
    var oppMultTLTR = normTLTR.clone().multiplyScalar(-this.line_width);
    var oppMultTLBL = normTLBL.clone().multiplyScalar(-this.line_width);
    verts[this.vert_inner_tl] = verts[this.vert_outter_tl].clone().add(multTLTR).add(multTLBL);
    verts[this.vert_inner_tr] = verts[this.vert_outter_tr].clone().add(oppMultTLTR).add(multTLBL);
    verts[this.vert_inner_br] = verts[this.vert_outter_br].clone().add(oppMultTLTR).add(oppMultTLBL);
    verts[this.vert_inner_bl] = verts[this.vert_outter_bl].clone().add(multTLTR).add(oppMultTLBL);

    return verts;
  },

  _make_faces: function () {
    var faces = [
      // top line
      new THREE.Face3(this.vert_outter_tl, this.vert_inner_tl, this.vert_outter_tr),
      new THREE.Face3(this.vert_outter_tr, this.vert_inner_tl, this.vert_inner_tr),
      // right line
      new THREE.Face3(this.vert_outter_tr, this.vert_inner_tr, this.vert_outter_br),
      new THREE.Face3(this.vert_outter_br, this.vert_inner_tr, this.vert_inner_br),
      // bottom line
      new THREE.Face3(this.vert_outter_br, this.vert_inner_br, this.vert_outter_bl),
      new THREE.Face3(this.vert_outter_bl, this.vert_inner_br, this.vert_inner_bl),
      // left line
      new THREE.Face3(this.vert_outter_bl, this.vert_inner_bl, this.vert_outter_tl),
      new THREE.Face3(this.vert_outter_tl, this.vert_inner_bl, this.vert_inner_tl),
    ];

    return faces;
  },
});