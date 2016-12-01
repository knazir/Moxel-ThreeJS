CONFIG = Object.freeze({
    CUBE_SIZE:              10,
    ORIGIN:                 {X: 0, Y: 0, Z: 0},
    BLOCK_TEXTURE_DIR:      'res/textures/blocks/',

    CHUNK_WIDTH:            20,
    CHUNK_HEIGHT:           10,
    CHUNK_LENGTH:           20,

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
    CAMERA_INITIAL_X:       45,
    CAMERA_INITIAL_Y:       20,
    CAMERA_INITIAL_Z:       220,
    CAMERA_MOVE_SPEED:      2,

    RENDERER_WIDTH:         window.innerWidth,
    RENDERER_HEIGHT:        window.innerHeight,
    RENDERER_CANVAS_ID:     '#container',
    RENDERER_ALPHA:         true,

    COLOR_SKY:              '#87CEFA',

    NOISE_OCTAVES:          5,
    NOISE_AMPLITUDE:        1.0,
    NOISE_PERSISTENCE:      0.45,
});

BLOCK_TYPES = Object.freeze({
    AIR:    0,
    DIRT:   1,
    STONE:  2,
    SAND:   3,

    0:  {NAME: 'AIR',       TEXTURE: null},
    1:  {NAME: 'DIRT',      TEXTURE: 'dirt.png'},
    2:  {NAME: 'STONE,',    TEXTURE: 'gravel_stone.png'},
    3:  {NAME: 'SAND',      TEXTURE: 'sand.png'}
});