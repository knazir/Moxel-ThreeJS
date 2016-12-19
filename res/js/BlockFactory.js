/**
 * Cube wrapper class (Block) instantiator
 */
function BlockFactory() {
    this.textureFactory = new TextureFactory();
    this.geometry       = new THREE.BoxBufferGeometry(CONFIG.CUBE_SIZE, CONFIG.CUBE_SIZE, CONFIG.CUBE_SIZE);

    this.createCubeMaterial = function(type) {
        if (BLOCK_TYPES[type]['NAME'] === 'AIR') {
            return null;
        }

        cubeMaterials = this.textureFactory.createTextureMaterials(type);
        return new THREE.MultiMaterial(cubeMaterials);
    };

    this.createCubeModel = function(x, y, z, type) {
        var material    = this.createCubeMaterial(type),
            cube        = new THREE.Mesh(this.geometry, material);
        cube.position.set(x, y, z);
        return cube;
    };
}

BlockFactory.prototype.constructor = BlockFactory;

BlockFactory.prototype.createBlock = function(x, y, z, type) {
    return (type === BLOCK_TYPES.AIR) ? STATIC_BLOCKS.AIR : new Block(type, this.createCubeModel(x, y, z, type));
};