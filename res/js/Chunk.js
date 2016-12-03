function Chunk(scene, width, height, length) {
    this.scene = scene;
    this.width = width;
    this.height = height;
    this.length = length;
    this.blockFactory = new BlockFactory();
    this.blocks = create3DArray(width, height, length);
}

Chunk.prototype.constructor = Chunk;

Chunk.prototype.generateBlocks = function() {
    for (var x = 0; x < this.width; x++) {
        for (var z = 0; z < this.length; z++) {
            var noiseValue = noise.perlin2(x * CONFIG.NOISE_FACTOR, z * CONFIG.NOISE_FACTOR);
            var actualHeight = 1 + Math.trunc(this.height * clamp(Math.abs(noiseValue))); // keep height at least 1

            // fill blocks
            for (var y = 0; y < actualHeight; y++) {
                var actualX = CONFIG.ORIGIN.X + (x * CONFIG.CUBE_SIZE),
                    actualY = CONFIG.ORIGIN.Y + (y * CONFIG.CUBE_SIZE),
                    actualZ = CONFIG.ORIGIN.Z + (z * CONFIG.CUBE_SIZE),
                    type    = getBlockTypeByHeight(y, actualHeight);
                this.blocks[x][y][z] = this.blockFactory.createBlock(actualX, actualY, actualZ, type);
            }

            // fill air
            for (y = actualHeight; y < this.height; y++) {
                actualX = CONFIG.ORIGIN.X + (x * CONFIG.CUBE_SIZE);
                actualY = CONFIG.ORIGIN.Y + (y * CONFIG.CUBE_SIZE);
                actualZ = CONFIG.ORIGIN.Z + (z * CONFIG.CUBE_SIZE);
                this.blocks[x][y][z] = this.blockFactory.createBlock(actualX, actualY, actualZ, BLOCK_TYPES.AIR);
            }
        }
    }

    // count neighbors
    for (x = 0; x < this.width; x++) {
        for (z = 0; z < this.length; z++) {
            for (y = 0; y < this.height; y++) {
                this.blocks[x][y][z].neighbors = countNeighbors(this.blocks, x, y, z);
            }
        }
    }
};

Chunk.prototype.addBlocksToScene = function() {
    for (var x = CONFIG.ORIGIN.X; x < this.width; x++) {
        for (var z = CONFIG.ORIGIN.Z; z < this.length; z++) {
            for (var y = CONFIG.ORIGIN.Y; y < this.height; y++) {
                var block = this.blocks[x][y][z];
                if (block.getType() !== BLOCK_TYPES.AIR && shouldRender(this.blocks[x][y][z])) {
                    this.scene.add(this.blocks[x][y][z].getCube());
                }
            }
        }
    }
};

Chunk.prototype.clearBlocksFromScene = function() {
    for (var x = CONFIG.ORIGIN.X; x < this.width; x++) {
        for (var z = CONFIG.ORIGIN.Z; z < this.length; z++) {
            for (var y = CONFIG.ORIGIN.Y; y < this.height; y++) {
                var block = this.blocks[x][y][z];
                if (block.getType() !== BLOCK_TYPES.AIR && shouldRender(this.blocks, x, y, z)) {
                    this.scene.remove(this.blocks[x][y][z].getCube());
                }
            }
        }
    }
};

Chunk.prototype.rerenderNeighbors = function(x, y, z) {
    for (var i = x - 1; i <= x + 1; i++) {
        for (var j = y - 1; j <= y + 1; j++) {
            for (var k = z - 1; k <= z + 1; k++) {
                if (inBounds(i, j, k, this.width, this.height, this.length) &&
                    shouldRender(this.blocks, i, j, k) && this.blocks[i][j][k].getType() !== BLOCK_TYPES.AIR) {
                    this.scene.add(this.blocks[i][j][k].getCube());
                }
            }
        }
    }
};

Chunk.prototype.removeBlock = function(x, y, z) {
    var voxelX = Math.trunc(x / CONFIG.CUBE_SIZE),
        voxelY = Math.trunc(y / CONFIG.CUBE_SIZE),
        voxelZ = Math.trunc(z / CONFIG.CUBE_SIZE);

    if (inBounds(voxelX, voxelY, voxelZ, this.width, this.height, this.length)) {
        this.scene.remove(this.blocks[voxelX][voxelY][voxelZ].getCube());
        this.blocks[voxelX][voxelY][voxelZ] = STATIC_BLOCKS.AIR;
        this.rerenderNeighbors(voxelX, voxelY, voxelZ);
    }
};