function Chunk(scene, width, height, length) {
    this.scene = scene;
    this.width = width;
    this.height = height;
    this.length = length;
    this.blockFactory = new BlockFactory();
    this.blocks = create3DArray(width, height, length);


    /* * * * * * * * * *
     * Private Methods *
     * * * * * * * * * */

    /*
     * Checks if the given coordinates are within the bounds of this chunk.
     */
    this.inBounds = function(x, y, z) {
        return x >= 0 && x < this.width && y >= 0 && y < this.height && z >= 0 && z < this.length;
    };

    /*
     * Counts the number of non-air blocks surrounding the block at the given coordinate (if it is within bounds).
     */
    this.countNeighbors = function(x, y, z) {
        var neighbors   = 0;

        for (var i = x - 1; i <= x + 1; i++) {
            for (var j = y - 1; j <= y + 1; j++) {
                for (var k = z - 1; k <= z + 1; k++) {
                    var cubeInBounds = this.inBounds(i, j, k);
                    if ((cubeInBounds && this.blocks[i][j][k].getType() !== BLOCK_TYPES.AIR)) {
                        neighbors++;
                    }
                }
            }
        }
        return neighbors;
    };
}


/* * * * * * * *  *
 * Public Methods *
 * * * * * * * *  */
Chunk.prototype.constructor = Chunk;

/*
 * Populates the 3D array of blocks with block objects.
 */
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
                    type    = Chunk.getBlockTypeByHeight(y, actualHeight);
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

    // count neighbors (must happen after all blocks in chunk set)
    for (x = 0; x < this.width; x++) {
        for (z = 0; z < this.length; z++) {
            for (y = 0; y < this.height; y++) {
                this.blocks[x][y][z].neighbors = this.countNeighbors(x, y, z);
            }
        }
    }
};

/*
 * Add blocks that should be rendered to the chunk's associated scene object.
 */
Chunk.prototype.addBlocksToScene = function() {
    for (var x = CONFIG.ORIGIN.X; x < this.width; x++) {
        for (var z = CONFIG.ORIGIN.Z; z < this.length; z++) {
            for (var y = CONFIG.ORIGIN.Y; y < this.height; y++) {
                var block = this.blocks[x][y][z];
                if (block.getType() !== BLOCK_TYPES.AIR && block.shouldRender()) {
                    this.scene.add(this.blocks[x][y][z].getCube());
                }
            }
        }
    }
};

/*
 * Removes all blocks that were (assumed to be) rendered from the chunk's associated scene object.
 */
Chunk.prototype.clearBlocksFromScene = function() {
    for (var x = CONFIG.ORIGIN.X; x < this.width; x++) {
        for (var z = CONFIG.ORIGIN.Z; z < this.length; z++) {
            for (var y = CONFIG.ORIGIN.Y; y < this.height; y++) {
                var block = this.blocks[x][y][z];
                if (block.getType() !== BLOCK_TYPES.AIR && block.shouldRender()) {
                    this.scene.remove(this.blocks[x][y][z].getCube());
                }
            }
        }
    }
};

/*
 * Checks if any neighbors surrounding a given block should now be rendered.
 */
Chunk.prototype.rerenderNeighbors = function(x, y, z) {
    for (var i = x - 1; i <= x + 1; i++) {
        for (var j = y - 1; j <= y + 1; j++) {
            for (var k = z - 1; k <= z + 1; k++) {
                if (this.inBounds(i, j, k) && this.blocks[i][j][k].shouldRender() &&
                    this.blocks[i][j][k].getType() !== BLOCK_TYPES.AIR) {
                    this.scene.add(this.blocks[i][j][k].getCube());
                }
            }
        }
    }
};

/*
 * Removes the specified block from the scene and checks if any of its neighbors should now be rendered.
 */
Chunk.prototype.removeBlock = function(x, y, z) {
    var voxelX = Math.trunc(x / CONFIG.CUBE_SIZE),
        voxelY = Math.trunc(y / CONFIG.CUBE_SIZE),
        voxelZ = Math.trunc(z / CONFIG.CUBE_SIZE);

    if (this.inBounds(voxelX, voxelY, voxelZ)) {
        this.scene.remove(this.blocks[voxelX][voxelY][voxelZ].getCube());
        this.blocks[voxelX][voxelY][voxelZ] = STATIC_BLOCKS.AIR;
        this.rerenderNeighbors(voxelX, voxelY, voxelZ);
    }
};


/* * * * * * * *  *
 * Static Methods *
 * * * * * * * *  */

/*
 * Given the current height and maximum heights of a column, returns the type of block that should be used.
 */
Chunk.getBlockTypeByHeight = function(currentHeight, maxColumnHeight) {
    if (currentHeight === maxColumnHeight - 1) {
        return BLOCK_TYPES.GRASS;
    } else if (currentHeight === maxColumnHeight - 2 || currentHeight === maxColumnHeight - 3) {
        return BLOCK_TYPES.DIRT;
    } else if (currentHeight === maxColumnHeight - 4) {
        return BLOCK_TYPES.SAND;
    } else {
        return BLOCK_TYPES.STONE;
    }
};