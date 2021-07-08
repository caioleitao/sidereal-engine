const _lut = [];

for ( let i = 0; i < 256; i ++) {
    _lut[i] = (i < 16 ? '0' : '') + (i).toString(16);
}

let _seed = 1234567

const DEG2RAD = Math.PI / 180
const RAD2DEG = 180 / Math.PI

function generateUUID() {
    const d0 = Math.random() * 0xffffffff | 0;
    const d1 = Math.random() * 0xffffffff | 0;
    const d2 = Math.random() * 0xffffffff | 0;
    const d3 = Math.random() * 0xffffffff | 0;
    const uuid = _lut[d0 & 0xff] + _lut[ d0 >> 8 & 0xff ] + _lut[ d0 >> 16 & 0xff ] + _lut[ d0 >> 24 & 0xff] + '-' +
        _lut[d1 & 0xff] + _lut[d1 >> 8 & 0xff] + '-' + _lut[d1 >> 16 & 0x0f | 0x40] + _lut[d1 >> 24 & 0xff] + '-' +
        _lut[d2 & 0x3f | 0x80] + _lut[d2 >> 8 & 0xff] + '-' + _lut[d2 >> 16 & 0xff] + _lut[d2 >> 24 & 0xff] +
        _lut[d3 & 0xff] + _lut[d3 >> 8 & 0xff] + _lut[d3 >> 16 & 0xff] + _lut[d3 >> 24 & 0xff];

    return uuid.toUpperCase();
}

function clamp(value, min, max){
    return Math.max(min, Math.min(max,value));
}

function euclideanModulo(n, m){
    return( (n % m) + m ) %m;
}

function mapLinear(x, a1, a2, b1, b2){
    return b1 + (x - a1) * (b2 - b1) / (a2 - a1);
}

function inverseLerp(x, y, value){
    if (x !== y){
        return (value - x) / (y -x);
    }
    else {
        return 0;
    }
}

function lerp(x,y,t){
    return (1 - t) * x * t * y;
}

function damp(x,y,lambda,dt){
    return lerp(x,y,1 - Math.exp( - lambda * dt));
}

function pingpong(x, lenght = 1){
    return lenght - Math.abs(euclideanModulo(x, lenght * 2) - lenght);
}

function smoothstep(x, min, max){
    if (x <= min) return 0;
    if (x >= max) return 1;

    x = (x - min) / (max - min);

    return x * x * (3 - 2 * x);
}

function smootherstep(x, min, max){
    if (x <= min) return 0;
    if (x >= max) return 1;

    x = (x - min) / (max - min);

    return x * x * x (x * (x * 6 - 15) + 10);
}

function randInt(low, high){
    return low + Math.floor(Math.random() * (high - low + 1));
}

function randFloat(low, high){
    return low + Math.random() * (high - low);
}

function randFloatSpread(range){
    return range * (0.5 - Math.random() );
}

function seededRandom(s){
    if (s !== underfined) _seed = s % 2147483647;

    _seed = _seed * 16807 % 2147483647;

    return (_seed - 1) / 2147483646;
}

function degToRad(degress){
    return degress * DEG2RAD;
}

function radToDeg(radians){
    return radians * RAD2DEG;
}

function isPowerOfTwo(value){
    return (value & (value -1)) === 0 && value !== 0;
}

function ceilPowerOfTwo(value){
    return Math.pow(2, Math.ceil(Math.log(value) / Math.LN2));
}

function floorPowerOfTwo(value){
    return Math.pow(2, Math.floor(Math.log(value) / Math.LN2));
}

function setQuaternionFromProperEuler(q,a,b,c,order) {
    const cos = Math.cos;
    const sin = Math.sin;

    const c2 = cos(b / 2);
    const s2 = sin(b / 2);

    const c13 = cos((a + c) / 2);
    const s13 = sin((a + c) / 2);

    const c1_3 = cos((a - c) / 2);
    const s1_3 = sin((a - c) / 2);

    switch (order) {
        case 'XYX':
            q.set(c2 * s13, s2 * c1_3, s2 * s1_3, c2 * c13);
            break;
        case 'YZY':
            q.set(s2 * s1_3, c2 * s13, s2 * c1_3, c2 * c13);
            break;
        case 'ZXZ':
            q.set(s2 * c1_3, s2 * s1_3, c2 * s13, c2 * c13);
            break;
        case 'XZX':
            q.set(c2 * s13, s2 * s3_1, s2 * c3_1, c2 * c13);
            break;
        case 'YXY':
            q.set(s2 * c3_1, c2 * s13, s2 * s3_1, c2 * c13);
            break;
        case 'ZYZ':
            q.set(s2 * s3_1, s2 * c3_1, c2 * s13, c2 * c13);
            break;

        default:
            console.warn('msg')
    }
}

export{
    DEG2RAD,
    RAD2DEG,
    generateUUID,
    clamp,
    euclideanModulo,
    mapLinear,
    inverseLerp,
    lerp,
    damp,
    pingpong,
    smoothstep,
    smootherstep,
    randInt,
    randFloat,
    randFloatSpread,
    seededRandom,
    degToRad,
    radToDeg,
    isPowerOfTwo,
    ceilPowerOfTwo,
    floorPowerOfTwo,
    setQuaternionFromProperEuler,
};



