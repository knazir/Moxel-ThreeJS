/**
 * ThreeJS cube wrapper class
 */
function Block(type, cube) {
    this.type = type;
    this.cube = cube;

    // TODO: Internally keep track of neighbor count to improve rerendering
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
    this.textureFactory = new TextureFactory();
    this.geometry       = new THREE.BoxBufferGeometry(CONFIG.CUBE_SIZE, CONFIG.CUBE_SIZE, CONFIG.CUBE_SIZE);

    this.createCubeMaterial = function(type) {
        if (BLOCK_TYPES[type]['NAME'] === 'AIR') {
            return;
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


/**
 * Cube texture creator
 */
function TextureFactory() {
    this.textureLoader = new THREE.TextureLoader();
    this.cachedTextures = {}; // cache texture material arrays to avoid recreating them

    this.createMaterialFromTexture = function(texture) {
        return new THREE.MeshLambertMaterial({ map: texture, shading: THREE.FlatShading });
    };

    this.createSimpleTexturedCube = function(cubeMeta) {
        if (cubeMeta.NAME in this.cachedTextures) {
            return this.cachedTextures[cubeMeta.NAME];
        }

        var texture         = this.textureLoader.load(CONFIG.BLOCK_TEXTURE_DIR + cubeMeta.TEXTURE),
            cubeMaterials   = [];
        for (var i = 0; i < 6; i++) {
            cubeMaterials.push(this.createMaterialFromTexture(texture));
        }

        this.cachedTextures[cubeMeta.NAME] = cubeMaterials;
        return cubeMaterials;
    };

    this.createToppedCube = function(cubeMeta) {
        if (cubeMeta.NAME in this.cachedTextures) {
            return this.cachedTextures[cubeMeta.NAME];
        }

        var topTexture      = this.textureLoader.load(CONFIG.BLOCK_TEXTURE_DIR + cubeMeta.TOP),
            bottomTexture   = this.textureLoader.load(CONFIG.BLOCK_TEXTURE_DIR + cubeMeta.BOTTOM),
            bodyTexture     = this.textureLoader.load(CONFIG.BLOCK_TEXTURE_DIR + cubeMeta.BODY_TEXTURE),
            cubeMaterials   = new Array(6);

        for (var i = 0; i < BLOCK_FACE_ASSIGNMENTS.BODY.length; i++) {
            cubeMaterials[BLOCK_FACE_ASSIGNMENTS.BODY[i]] = this.createMaterialFromTexture(bodyTexture);
        }
        cubeMaterials[BLOCK_FACE_ASSIGNMENTS.TOP]       = this.createMaterialFromTexture(topTexture);
        cubeMaterials[BLOCK_FACE_ASSIGNMENTS.BOTTOM]    = this.createMaterialFromTexture(bottomTexture);

        this.cachedTextures[cubeMeta.NAME] = cubeMaterials;
        return cubeMaterials;
    };

    this.createCustomMappedCube = function(cubeMeta) {
        if (cubeMeta.NAME in this.cachedTextures) {
            return this.cachedTextures[cubeMeta.NAME]
        }

        var topTexture      = this.textureLoader.load(CONFIG.BLOCK_TEXTURE_DIR + cubeMeta.TOP),
            bottomTexture   = this.textureLoader.load(CONFIG.BLOCK_TEXTURE_DIR + cubeMeta.BOTTOM),
            leftTexture     = this.textureLoader.load(CONFIG.BLOCK_TEXTURE_DIR + cubeMeta.LEFT),
            rightTexture    = this.textureLoader.load(CONFIG.BLOCK_TEXTURE_DIR + cubeMeta.RIGHT),
            frontTexture    = this.textureLoader.load(CONFIG.BLOCK_TEXTURE_DIR + cubeMeta.FRONT),
            backTexture     = this.textureLoader.load(CONFIG.BLOCK_TEXTURE_DIR + cubeMeta.BACK),
            cubeMaterials   = new Array(6);

        cubeMaterials[BLOCK_FACE_ASSIGNMENTS.TOP]       = this.createMaterialFromTexture(topTexture);
        cubeMaterials[BLOCK_FACE_ASSIGNMENTS.BOTTOM]    = this.createMaterialFromTexture(bottomTexture);
        cubeMaterials[BLOCK_FACE_ASSIGNMENTS.LEFT]      = this.createMaterialFromTexture(leftTexture);
        cubeMaterials[BLOCK_FACE_ASSIGNMENTS.RIGHT]     = this.createMaterialFromTexture(rightTexture);
        cubeMaterials[BLOCK_FACE_ASSIGNMENTS.FRONT]     = this.createMaterialFromTexture(frontTexture);
        cubeMaterials[BLOCK_FACE_ASSIGNMENTS.BACK]      = this.createMaterialFromTexture(backTexture);

        this.cachedTextures[cubeMeta.NAME] = cubeMaterials;
        return cubeMaterials;
    };
}

TextureFactory.prototype.constructor = TextureFactory;

TextureFactory.prototype.createTextureMaterials = function(cubeType) {
    var cubeMeta        = BLOCK_TYPES[cubeType],
        cubeMaterials   = [];

    if (cubeMeta.TYPE === 'simple') {
        cubeMaterials = this.createSimpleTexturedCube(cubeMeta);
    } else if (cubeMeta.TYPE === 'topped') {
        cubeMaterials = this.createToppedCube(cubeMeta);
    } else if (cubeMeta.TYPE === 'custom') {
        cubeMaterials = this.createCustomMappedCube(cubeMeta)
    }

    return cubeMaterials;
};