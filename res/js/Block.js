/**
 * ThreeJS cube wrapper class
 */
function Block(type, cube) {
    this.type = type;
    this.cube = cube;
}

Block.prototype.constructor = Block;

Block.prototype.getCube = function() {
    return this.cube;
};

Block.prototype.getType = function() {
    return this.type;
};


/**
 * Cube wrapper class instantiator
 */
function BlockFactory() {
    this.getTextureFileByBlockType = function(type) {
        return CONFIG.BLOCK_TEXTURE_DIR + BLOCK_TYPES[type].TEXTURE;
    };

    this.createCubeMaterial = function(type) {
        if (BLOCK_TYPES[type]['NAME'] === 'AIR') {
            return;
        }

        var textureLoader   = new THREE.TextureLoader(),
            texture         = textureLoader.load(this.getTextureFileByBlockType(type)),
            cubeMaterials   = [];
        for (var i = 0; i < 6; i++) {
            cubeMaterials.push(new THREE.MeshLambertMaterial({ map: texture }));
        }
        return new THREE.MultiMaterial(cubeMaterials);
    };

    this.createCubeModel = function(x, y, z, type) {
        var geometry    = new THREE.BoxGeometry(CONFIG.CUBE_SIZE, CONFIG.CUBE_SIZE, CONFIG.CUBE_SIZE),
            material    = this.createCubeMaterial(type),
            cube        = new THREE.Mesh(geometry, material);
        cube.position.set(x, y, z);
        return cube;
    };
}

BlockFactory.prototype.constructor = BlockFactory;

BlockFactory.prototype.createBlock = function(x, y, z, type) {
    return new Block(type, this.createCubeModel(x, y, z, type));
};