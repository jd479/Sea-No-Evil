const Util = {
  wrap (coord, edge) {
    if (coord < 0) {
      return edge - (coord % edge);
    } else if (coord > edge) {
      return coord % edge;
    } else {
      return coord;
    }
  }
};

module.exports = Util;
