import { EventDispatcher } from '../core/EventDispatcher.js';
import {
    MirroredRepeatWrapping,
    ClampToEdgeWrapping,
    RepeatWrapping,
    LinearEncoding,
    UnsignedByteType,
    RGBAFormat,
    LinearMipmapLinearFilter,
    LinearFilter,
    UVMapping
} from '../constants.js';
import * as MathUtils from '../math/MathUtils.js';
import { Vector2 } from '../math/Vector3.js';
import { Matrix3 } from '../math/Matrix3.js';
import { ImageUtils } from '../extras/ImageUtils.js';

let textureId = 0;

class Texture extends EventDispatcher {
    constructor(image = Texture.DEFAULT_IMAGE, mapping = Texture.DEFAULT_MAPPING, wrapS = ClampToEdgeWrapping, wrapT = ClampToEdgeWrapping, magFilter = LinearFilter, minFilter = LinearMipmapLinearFilter, format = RGBAFormat, type = UnsignedByteType, anisotropy = 1, encoding = LinearEncoding) {
        super();

        Object.defineProperties(this, 'id', {value: textureId ++});

        this.uuid = MathUtils.generateUUID();

        this.name = '';

        this.image = image;
        this.mipmaps = [];

        this.mapping = mapping;

        this.wrapS = wrapS;
        this.wrapT = wrapT;

        this.magFilter = magFilter;
        this.minFilter = minFilter;

        this.anisotropy = anisotropy;

        this.format = format;
        this.internalFormat = null;
        this.type = type;

        this.offset = new Vector2(0,0);
        this.repeat = new Vector2(1,1);
        this.center = new Vector2(0,0);
        this.rotation = 0;

        this.matrixAutoUpdate = true;
        this.matrix = new Matrix3();

        this.generateMipmaps = true;
        this.premultiplyAlpha = false;
        this.flipY = true;
        this.unpackAlignment = 4;

        this.encoding = encoding;

        this.version = 0;
        this.onUpdate = null;
    }

    updateMatrix() {
        this.matrix.setUvTransform(this.offset.x, this.offset.y, this.repeat.x, this.repeat.y, this.rotation, this.center.x, this.center.y);
    }

    clone() {
        return new this.constructor().copy(this);
    }

    copy(source) {
        this.name = source.name;

        this.image = source.image;
        this.mipmaps = source.mipmaps.slice(0);

        this.mapping = source.mapping;

        this.wrapS = source.wrapS;
        this.wrapT = source.wrapT;

        this.magFilter = source.magFilter;
        this.minFilter = source.minFilter;

        this.anisotropy = source.anisotropy;

        this.format = source.format;
        this.internalFormat = source.internalFormat;
        this.type = source.type;

        this.offset.copy(source.offset);
        this.repeat.copy(source.repeat);
        this.center.copy(source.center);
        this.rotation = source.rotation;

        this.matrixAutoUpdate = source.matrixAutoUpdate;
        this.matrix.copy(source.matrix);

        this.generateMipmaps = source.generateMipmaps;
        this.premultiplyAlpha = source.premultiplyAlpha;
        this.flipY = source.flipY;
        this.unpackAlignment = source.unpackAlignment;
        this.encoding = source.encoding;

        return this;
    }

    toJSON(meta){

    }
}