CONFIG = Object.freeze({
    CUBE_SIZE:              10,
    ORIGIN:                 {X: 0, Y: 0, Z: 0},
    BLOCK_TEXTURE_DIR:      'res/textures/blocks/',

    CHUNK_WIDTH:            20,
    CHUNK_HEIGHT:           20,
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
    CAMERA_FAR_PLANE:       10000,
    CAMERA_INITIAL_X:       45,
    CAMERA_INITIAL_Y:       20,
    CAMERA_INITIAL_Z:       220,
    CAMERA_MOVE_SPEED:      2,

    RENDERER_WIDTH:         window.innerWidth,
    RENDERER_HEIGHT:        window.innerHeight,
    RENDERER_CANVAS_ID:     '#container',
    RENDERER_ALPHA:         false,
    RENDERER_ANTIALAIS:     true,

    SKYBOX_SIZE:            5000,
    SKYBOX_WIDTH:           50,
    SKYBOX_HEIGHT:          50,
    SKYBOX_COLOR:           '#87CEFA',
    SKYBOX_ORIGIN:          {X: 0, Y: 0, Z: 0},

    NOISE_OCTAVES:          5,
    NOISE_AMPLITUDE:        1.0,
    NOISE_PERSISTENCE:      0.45,
    NOISE_FACTOR:           0.05
});

BLOCK_TYPES = Object.freeze({
    // Name -> Code
    AIR:    0,
    DIRT:   1,
    STONE:  2,
    SAND:   3,
    GRASS:  4,
    SKYBOX: 99,

    // Code -> Meta
    0:  {
            NAME: 'AIR',
            TYPE: 'simple',
            TEXTURE: null
        },
    1:  {
            NAME: 'DIRT',
            TYPE: 'simple',
            TEXTURE: 'dirt.png'
        },
    2:  {
            NAME: 'STONE',
            TYPE: 'simple',
            TEXTURE: 'gravel_stone.png'
        },
    3:  {
            NAME: 'SAND',
            TYPE: 'simple',
            TEXTURE: 'sand.png'
        },
    4:  {
            NAME: 'GRASS',
            TYPE: 'topped',
            BODY_TEXTURE: 'dirt_grass.png', TOP: 'grass_top.png',   BOTTOM: 'dirt.png'
        },
    99: {
            NAME:   'SKYBOX',
            TYPE:   'custom',
            TOP:    'skybox_top.png',       BOTTOM: 'skybox_bottom.png',        LEFT: 'skybox_side.png',
            RIGHT:  'skybox_sideHills.png', FRONT:  'skybox_sideClouds.png',    BACK: 'skybox_side.png',
            SPHERE: 'skybox_top.png'
        }
});

STATIC_BLOCKS = {
    AIR: new Block(0, null)
};

BLOCK_FACE_ASSIGNMENTS = {
    LEFT:   0,
    RIGHT:  1,
    TOP:    2,
    BOTTOM: 3,
    FRONT:  4,
    BACK:   5,
    BODY: [0, 1, 4, 5]
};