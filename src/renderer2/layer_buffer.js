/*
 * base this off of TileBuffer
 * should be basically the same, but accepts norms instead of calc. them
 * and is aggregated by the render, not the other way around
 *
 * should maybe have an add and update face method
 */
flatsim.LayerBuffer = function (gl, verts, faces, colors, norms) {};
flatsim.LayerBuffer.prototype = {};
