/* * * * * * * * * * * * *
 * Methods for Constants *
 * * * * * * * * * * * * */
var degreesToRadians = function(degrees) {
    return degrees * (Math.PI / 180);
};

/* * * * * * *
 * Constants *
 * * * * * * */
var BUTTON_HEIGHT       = 50,
    BUTTON_CUBE_ID      = '#cube',
    BUTTON_DICE_ID      = '#dice';

var LIGHT_COLOR         = 0xffffff, // white
    LIGHT_BRIGHTNESS    = 1,
    LIGHT_INITIAL_X     = 0,
    LIGHT_INITIAL_Y     = 0,
    LIGHT_INITIAL_Z     = 50;

var CAMERA_FOV          = 35,
    CAMERA_ASPECT_RATIO = window.innerWidth / window.innerHeight,
    CAMERA_NEAR_PLANE   = 1,
    CAMERA_FAR_PLANE    = 1000,
    CAMERA_INITIAL_X    = 0,
    CAMERA_INITIAL_Y    = 0,
    CAMERA_INITIAL_Z    = 100;

var RENDERER_WIDTH      = window.innerWidth,
    RENDERER_HEIGHT     = window.innerHeight - BUTTON_HEIGHT,
    RENDERER_CANVAS_ID  = '#container',
    RENDERER_ALPHA      = true;

var CUBE_SIZE           = 20,
    CUBE_BACKGROUND     = '#000000',
    DICE_BACKGROUND     = '#24873A',
    CUBE_ROTATION_DX    = 0.5,
    CUBE_ROTATION_DY    = 0.5,
    CUBE_ROTATION_DZ    = 0.5;

var ANIMATION_MILLIS    = 200,
    ANIMATION_CHANGES   = 5;

var DICE_FACE_POSITIONS = {
    1: { x: 0, y: degreesToRadians(270), z: 0 },
    2: { x: 0, y: degreesToRadians(90),  z: 0 },
    3: { x: degreesToRadians(90), y: 0,  z: 0 },
    4: { x: degreesToRadians(270), y: 0, z: 0 },
    5: { x: 0, y: 0, z: 0 },
    6: { x: degreesToRadians(180), y: 0, z: 0 }
};

/* * * * * * * * * * *
 * Component Methods *
 * * * * * * * * * * */
var createScene = function() {
    return new THREE.Scene();
};

var createLight = function() {
    var light = new THREE.PointLight(LIGHT_COLOR, LIGHT_BRIGHTNESS);
    light.position.set(LIGHT_INITIAL_X, LIGHT_INITIAL_Y, LIGHT_INITIAL_Z);
    return light;
};

var createCamera = function() {
    var camera = new THREE.PerspectiveCamera(CAMERA_FOV, CAMERA_ASPECT_RATIO, CAMERA_NEAR_PLANE, CAMERA_FAR_PLANE);
    camera.position.set(CAMERA_INITIAL_X, CAMERA_INITIAL_Y, CAMERA_INITIAL_Z);
    return camera;
};

var createRenderer = function() {
    var renderer = new THREE.WebGLRenderer({ alpha: RENDERER_ALPHA });
    renderer.setSize(RENDERER_WIDTH, RENDERER_HEIGHT);
    var canvasContainer = document.querySelector(RENDERER_CANVAS_ID);
    canvasContainer.innerHTML = '';
    canvasContainer.appendChild(renderer.domElement);
    return renderer;
};

var createSampleMaterial = function() {
    if (diceSample) {
        var textureLoader = new THREE.TextureLoader();
        var materials = [];
        for (var i = 1; i <= 6; i++) {
            var texture = textureLoader.load('res/textures/sample/dice/' + i + '.jpg');
            materials.push(new THREE.MeshLambertMaterial({ map: texture }));
        }
        return new THREE.MultiMaterial(materials);
    } else {
        return new THREE.MeshNormalMaterial();
    }
};

var createCube = function() {
    var geometry    = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE),
        material    = createSampleMaterial();
    return new THREE.Mesh(geometry, material);
};


/* * * * * * * * * *
 * Rendering Logic *
 * * * * * * * * * */
var addElementsToScene = function(scene) {
    for (var i = 1; i < arguments.length; i++) {
        scene.add(arguments[i]);
    }
};

var rotateCube = function() {
    cube.rotation.x += degreesToRadians(CUBE_ROTATION_DX);
    cube.rotation.y += degreesToRadians(CUBE_ROTATION_DY);
    cube.rotation.z += degreesToRadians(CUBE_ROTATION_DZ);
};

var draw = function() {
    var initialSample = diceSample;
    window.requestAnimationFrame(function() {
        if (initialSample != diceSample) {
            return;
        }
        diceSample ? TWEEN.update() : rotateCube();
        renderer.render(scene, camera);
        draw();
    });
};

var getRandomDieValue = function() {
    return Math.floor((Math.random() * 6) + 1);
};

var rollDie = function() {
    var result      = getRandomDieValue(),
        tweens      = [],
        finalTween  = new TWEEN.Tween(cube.rotation).to({
            x: DICE_FACE_POSITIONS[result].x,
            y: DICE_FACE_POSITIONS[result].y,
            z: DICE_FACE_POSITIONS[result].z
        }, ANIMATION_MILLIS);


    // cube exists in global scope
    for (var i = 0; i < ANIMATION_CHANGES; i++) {
        tweens.push(new TWEEN.Tween(cube.rotation).to({
            x: getRandomDieValue(),
            y: getRandomDieValue(),
            z: getRandomDieValue()
        }, ANIMATION_MILLIS));

        if (i > 0) {
            tweens[i - 1].chain(tweens[i]);
        }
    }

    tweens[tweens.length - 1].chain(finalTween);
    tweens[0].start();
};


/* * * * * * * * * * * *
 * Components/Settings *
 * * * * * * * * * * * */
var light       = createLight(),
    camera      = createCamera(),
    scene       = createScene(light, camera),
    renderer    = createRenderer(),
    cube        = createCube();

var diceSample = false;


/* * * * * * * *
 * Scene Setup *
 * * * * * * * */
var resetElements = function() {
    light       = createLight();
    camera      = createCamera();
    scene       = createScene(light, camera);
    renderer    = createRenderer();
    cube        = createCube();
};

var setBackground = function() {
    if (diceSample) {
        document.body.style.backgroundColor = DICE_BACKGROUND;
    } else {
        document.body.style.backgroundColor = CUBE_BACKGROUND;
    }
};

var resetScene = function() {
    setBackground();
    renderer.clear();
    resetElements();
    renderSample();
};

var switchToDiceSample = function() {
    if (!diceSample) {
        diceSample = true;
        document.addEventListener('click', rollDie);
        resetScene();
    }
};

var switchToCubeSample = function() {
    if (diceSample) {
        diceSample = false;
        document.removeEventListener('click', rollDie);
        resetScene();
    }
};

var setupControls = function() {
    document.querySelector(BUTTON_CUBE_ID).onclick = switchToCubeSample;
    document.querySelector(BUTTON_DICE_ID).onclick = switchToDiceSample;
};

var renderSample = function() {
    addElementsToScene(scene, light, camera, cube);
    setBackground();
    renderer.render(scene, camera);
    draw();
};

setupControls();
renderSample();