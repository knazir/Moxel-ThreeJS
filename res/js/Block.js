/**
 * ThreeJS cube wrapper class
 */
function Block(type, cube) {
    this.type = type;
    this.cube = cube;
}

Block.prototype.constructor = Block;

Block.prototype.neighbors = 0;

Block.prototype.getCube = function() {
    return this.cube;
};

Block.prototype.getType = function() {
    return this.type;
};