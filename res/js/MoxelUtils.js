/* * * * * *
 * General *
 * * * * * */
var randomInteger = function(low, high) {
    var min = Math.ceil(low),
        max = Math.floor(high);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};


/* * * * *
 * Chunk *
 * * * * */
var create3DArray = function(width, height, length) {
    var blocks = new Array(width);
    for (var i = 0; i < width; i++) {
        blocks[i] = new Array(height);
        for (var j = 0; j < height; j++) {
            blocks[i][j] = new Array(length);
        }
    }
    return blocks;
};


/* * * * * * * * * * * * * *
 * Perlin Noise Generation *
 * * * * * * * * * * * * * *
 *
 * TODO: Move noise generation from library to this custom implementation
 */
var clamp = function(value) {
    return Math.min(Math.max(value, 0), 1);
};

var getEmptyArray = function(width, height) {
    var image = new Array(width);
    for (var i = 0; i < width; i++) {
        image[i] = new Array(height);
        for (var j = 0; j < height; j++) {
            image[i][j] = 0.0;
        }
    }
    return image;
};

var interpolate = function(x0, x1, alpha) {
    return x0 * (1 - alpha) + alpha * x1;
};

var generateWhiteNoise = function(width, height) {
    var noise = getEmptyArray(width, height);
    for (var i = 0; i < width; i++) {
        for (var j = 0; j < height; j++) {
            noise[i][j] = Math.random() % 1;
        }
    }
    return noise;
};

var generateSmoothNoise = function(baseNoise, octave) {
    var width           = baseNoise.length,
        height          = baseNoise[0].length,
        smoothNoise     = getEmptyArray(width, height),
        samplePeriod    = 1 << octave, // calculates 2 ^ k
        sampleFrequency = 1.0 / samplePeriod;

    for (var i = 0; i < width; i++) {
        // calculate horizontal sampling indices
        var sampleI0        = (i / samplePeriod) * samplePeriod,
            sampleI1        = (sampleI0 + samplePeriod) % width, // wrap around
            horizontalBlend = (i - sampleI0) * sampleFrequency;

        for (var j = 0; j < height; j++) {
            // calculate the vertical sampling indices
            var sampleJ0        = (j / samplePeriod) * samplePeriod,
                sampleJ1        = (sampleJ0 + samplePeriod) % height,
                verticalBlend   = (j - sampleJ0) * sampleFrequency,
                top             = interpolate(baseNoise[sampleI0][sampleJ0],
                                              baseNoise[sampleI1][sampleJ0], horizontalBlend),
                bottom          = interpolate(baseNoise[sampleI0][sampleJ1],
                                              baseNoise[sampleI1][sampleJ1], horizontalBlend);
            smoothNoise[i][j] = interpolate(top, bottom, verticalBlend);
        }
    }
    return smoothNoise;
};

var generatePerlinNoiseArray = function(baseNoise, octaveCount) {
    var width       = baseNoise.length,
        height      = baseNoise[0].length,
        smoothNoise = new Array(octaveCount),
        persistence = CONFIG.NOISE_PERSISTENCE;

    // generate smooth noise
    for (var i = 0; i < octaveCount; i++) {
        smoothNoise[i] = generateSmoothNoise(baseNoise, i);
    }

    var perlinNoise     = getEmptyArray(width, height), // an array of floats initialized to 0
        amplitude       = CONFIG.NOISE_AMPLITUDE,
        totalAmplitude  = 0.0; // blend noise together

    for (var octave = octaveCount - 1; octave >= 0; octave--) {
        amplitude *= persistence;
        totalAmplitude += amplitude;

        for (i = 0; i < width; i++) {
            for (var j = 0; j < height; j++) {
                perlinNoise[i][j] += smoothNoise[octave][i][j] * amplitude;
            }
        }
    }
    return perlinNoise;
};

var generatePerlinNoise = function(width, height, octaveCount) {
    var baseNoise = generateWhiteNoise(width, height);
    return generatePerlinNoiseArray(baseNoise, octaveCount);
};