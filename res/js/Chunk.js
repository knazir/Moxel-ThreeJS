function Chunk(width, height, length) {
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
            var actualHeight = randomInteger(1, this.height);

            // fill blocks
            for (var y = 0; y < actualHeight; y++) {
                var actualX = CONFIG.ORIGIN.X + (x * CONFIG.CUBE_SIZE),
                    actualY = CONFIG.ORIGIN.Y + (y * CONFIG.CUBE_SIZE),
                    actualZ = CONFIG.ORIGIN.Z + (z * CONFIG.CUBE_SIZE);
                this.blocks[x][y][z] = this.blockFactory.createBlock(actualX, actualY, actualZ, randomInteger(1, 3));
            }

            // fill air
            for (y = actualHeight; y < this.height; y++) {
                actualX = CONFIG.ORIGIN.X + (x * CONFIG.CUBE_SIZE);
                actualY = CONFIG.ORIGIN.Y + (y * CONFIG.CUBE_SIZE);
                actualZ = CONFIG.ORIGIN.Z + (z * CONFIG.CUBE_SIZE);
                this.blocks[x][y][z] = this.blockFactory.createBlock(actualX, actualY, actualZ, 0);
            }
        }
    }
};

Chunk.prototype.addBlocksToScene = function(scene) {
    for (var x = CONFIG.ORIGIN.X; x < this.width; x++) {
        for (var z = CONFIG.ORIGIN.Z; z < this.length; z++) {
            for (var y = CONFIG.ORIGIN.Y; y < this.height; y++) {
                var block = this.blocks[x][y][z];
                if (BLOCK_TYPES[block.getType()]['NAME'] !== 'AIR' && shouldRender(this.blocks, x, y, z)) {
                    scene.add(this.blocks[x][y][z].getCube());
                }
            }
        }
    }
};