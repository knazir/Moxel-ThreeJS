CONFIG = Object.freeze({
    CUBE_SIZE:              1,
    ORIGIN:                 {X: 0, Y: 0, Z: 0},
    BLOCK_TEXTURE_DIR:      'res/textures/blocks/',

    CHUNK_WIDTH:            10,
    CHUNK_HEIGHT:           5,
    CHUNK_LENGTH:           10,

    LIGHT_COLOR:            0xffffff, // white
    LIGHT_BRIGHTNESS:       1,
    LIGHT_INITIAL_X:        0,
    LIGHT_INITIAL_Y:        0,
    LIGHT_INITIAL_Z:        50,
    LIGHT_FOLLOW_CAMERA:    true,

    CAMERA_FOV:             35,
    CAMERA_ASPECT_RATIO:    window.innerWidth / window.innerHeight,
    CAMERA_NEAR_PLANE:      1,
    CAMERA_FAR_PLANE:       1000,
    CAMERA_INITIAL_X:       0,
    CAMERA_INITIAL_Y:       0,
    CAMERA_INITIAL_Z:       100,
    CAMERA_MOVE_SPEED:      2,

    RENDERER_WIDTH:         window.innerWidth,
    RENDERER_HEIGHT:        window.innerHeight,
    RENDERER_CANVAS_ID:     '#container',
    RENDERER_ALPHA:         true,

    COLOR_SKY:              '#87CEFA'
});

BLOCK_TYPES = Object.freeze({
    0:  {NAME: 'AIR',       TEXTURE: null},
    1:  {NAME: 'DIRT',      TEXTURE: 'dirt.png'},
    2:  {NAME: 'STONE,',    TEXTURE: 'gravel_stone.png'},
    3:  {NAME: 'SAND',      TEXTURE: 'sand.png'}
});