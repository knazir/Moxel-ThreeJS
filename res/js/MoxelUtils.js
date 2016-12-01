var randomInteger = function(low, high) {
    var min = Math.ceil(low),
        max = Math.floor(high);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

var create3DArray = function(width, height, length) {
    var blocks = new Array(width);
    for (var i = 0; i < width; i++) {
        blocks[i] = new Array(height);
        for (var j = 0; j < height; j++) {
            blocks[i][j] = new Array(length);
        }
    }
    return blocks;
};

var inBounds = function(x, y, z, width, height, length) {
  return x >= 0 && x < width && y >= 0 && y < height && z >= 0 && z < length;
};

var shouldRender = function(blocks, x, y, z) {
    // TODO: Implement this.
    return true;
};