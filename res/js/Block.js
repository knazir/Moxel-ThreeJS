/**
 * ThreeJS cube wrapper class
 */
function Block(type, cube) {
    this.type = type;
    this.cube = cube;
    this.neighbors = 0;
}

Block.prototype.constructor = Block;

Block.prototype.getCube = function() {
    return this.cube;
};

Block.prototype.getType = function() {
    return this.type;
};

Block.prototype.shouldRender = function() {
    return this.neighbors !== CONFIG.NEIGHBORS_TO_CULL;
};