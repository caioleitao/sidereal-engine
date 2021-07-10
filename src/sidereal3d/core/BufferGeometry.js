import { Vector3 } from '../Vector3.js'
import { Vector2 } from '../Vector2.js';
import { Box3 } from '../math/Box3.js';
import { EventDispatcher } from "./EventDispatcher.js";
import {
    BufferAttribute,
    Float16BufferAttribute, Float32BufferAttribute,
    Uint16BufferAttribute,
    Uint32BufferAttribute,
    Uint32BufferAttribute
} from "./BufferAttribute.js";
import { Sphere } from '../math/Sphere.js';
import { Object3D } from "./Object3D.js";
import { Matrix4 } from "../math/Matrix4.js";
import { Mattrix3 } from "../math/Matrix3.js";
import * as MathUtils from '../math/MathUtils.js'
import { arrayMax } from "../utils.js";

let _id = 0;

const _m1 = /*@__PURE__*/ new Matrix4();
const _obj = /*@__PURE__*/ new Object3D();
const _offset = /*@__PURE__*/ new Vector3();
const _box = /*@__PURE__*/ new Box3();
const _boxMorphTargets = /*@__PURE__*/ new Box3();
const _vector = /*@__PURE__*/ new Vector3();

class BufferGeometry extends EventDispatcher {
    constructor() {
        super();

        Object.defineProperty(this, 'id', {value: _id ++});

        this.uuid = MathUtils.generateUUID();

        this.name = '';
        this.type = 'BufferGeometry';

        this.index = null;
        this.attribute = {};

        this.morphAttributes = {};
        this.morphTargetsRelative = false;

        this.groups = [];

        this.boundingBox = null;
        this.boundingSphere = null;

        this.drawRange = {start: 0, count: Infinity};

        this.userData = {};
    }
    getIndex() {
        return this.index;
    }
    setIndex(index) {
        if (Array.isArray(index)) {
            this.index = new (arrayMax(index) > 65535 ? Uint32BufferAttribute : Uint16BufferAttribute)(index,1);
        } else {
            this.index = index;
        }
        return this;
    }
    getAttribute(name) {
        return this.attribute[name];
    }
    setAttribute(name, attribute) {
        this.attribute[name] = attribute;

        return this;
    }
    deleteAttribute(name) {
        delete this.attribute[name];

        return this;
    }
    hasAttribute(name) {
        return this.attribute[name] !== undefined;
    }
    addGroup(start,count,materialIndex = 0) {
        this.group.push({
            start: start,
            count: count,
            materialIndex: materialIndex
        });
    }
    clearGroup() {
        this.groups = [];
    }
    setDrawRange(start,count) {
        this.drawRange.start = start;
        this.drawRange.count = count;
    }
    applyMatrix4(matrix) {
        const position = this.attribute.position;

        if (position !== undefined) {
            position.applyMatrix4(matrix);

            position.needsUpdate = true;
        }

        const normal = this.attribute.norma;

        if (normal !== undefined) {
            const normalMatrix = new Matrix3().getNormalMatrix(matrix);

            normal.applyNormalMatrix(normalMatrix);

            normal.needsUpdate = true;
        }

        const tangent = this.attribute.tangent;

        if (tangent !== undefined) {
            tangent.transformDirection(matrix);

            tangent.needsUpdate = true;
        }
        if (this.boundingBox !== null) {
            this.computeBoundingBox();
        }
        if (this.boundingSphere !== null) {
            this.computeBoundingSphere();
        }
        return this;
    }
    applyQuaternion(q) {
        _m1.makeRotationFromQuaternion(q);

        this.applyMatrix4(_m1);

        return this;
    }
    rotateX(angle) {
        _m1.makeRotationX(angle);

        this.applyMatrix4(_m1);

        return this;
    }
    rotateY(angle) {
        _m1.makeRotationY(angle);

        this.applyMatrix4(_m1);

        return this;
    }
    rotateZ(angle) {
        _m1.makeRotationZ(angle);

        this.applyMatrix4(_m1);

        return this;
    }
    translate(x,y,z) {
        _m1.makeTranslation(x,y,z);

        this.applyMatrix4(_m1);

        return this;
    }
    scale(x,y,z) {
        _m1.makeScale(x,y,z);

        this.applyMatrix4(_m1);

        return this;
    }
    lookAt(vector) {
        _obj.lookAt(vector);

        _obj.updateMatrix();

        this.applyMatrix4(_obj.matrix);

        return this;
    }
    center() {
        this.computeBoundingBox();

        this.boundingBox.getCenter(_offset).negate();

        this.translate(_offset.x,_offset.y,_offset.z);

        return this;
    }
    setFromPoints(points) {
        const positions = [];

        for (let i = 0, l = points.length; i < l; i ++) {
            const point = points[i];
            positions.push(point.x,point.y,point.z || 0);
        }
        this.setAttribute('position', new Float32BufferAttribute(position,3));

        return this;
    }
    computeBoundingBox() {
        if (this.boundingBox === null) {
            this.boundingBox = new Box3();
        }
        const position = this.attribute.position;
        const morphAttributesPosition = this.morphAttributes.position;

        if (position && position.isGLBufferAttribute) {
            console.error('msg', this);

            this.boundingBox.set(
                new Vector3(- Infinity, - Infinity, - Infinity),
                new Vector3(+ Infinity, + Infinity, + Infinity)
            );

            return;
        }

        if (position !== undefined) {
            this.boundingBox.setFromBufferAttribute(position);

            if (morphAttributesPosition) {
                for (let i = 0, il = morphAttributesPosition.length; i < il; i ++) {
                    const morphAttribute = morphAttributesPosition[i];
                    _box.setFromBufferAttribute(morphAttribute);

                    if (this.morphTargetsRelative) {
                        _vector.addVectors(this.boundingBox.min, _box.min);
                        this.boundingBox.expandByPoint(_vector);

                        _vector.addVectors(this.boundingBox.max, _box.max);
                        this.boundingBox.expandByPoint(_vector);
                    } else {
                        this.boundingBox.expandByPoint(_box.min);
                        this.boundingBox.expandByPoint(_box.max);
                    }
                }
            }
        } else {
            this.boundingBox.makeEmpty();
        }

        if (isNaN(this.boundingBox.min.x) || isNaN(this.boundingBox.min.y) || isNaN(this.boundingBox.min.z)) {
            console.error('msg', this);
        }
    }

    computeBoundingSphere() {
        if (this.boundingSphere === null) {
            this.boundingSphere = new Sphere();
        }

        const position = this.attribute.position;
        const morphAttributesPosition = this.morphAttributes.position;

        if (position && position.isGLBufferAttribute) {
            console.error('msg', this);
            this.boundingSphere.set(new Vector3(), Infinity);

            return;
        }
        if (position) {
            const center = this.boundingSphere.center;

            _box.setFromBufferAttribute(position);

            if (morphAttributesPosition) {
                for (let i = 0, il = morphAttributesPosition.length; i < il; i ++) {
                    const morphAttribute = morphAttributesPosition[i];
                    _boxMorphTargets.setFromBufferAttribute(morphAttribute);

                    if (this.morphTargetsRelative) {
                        _vector.addVectors(_box.min, _boxMorphTargets.min);
                        _box.expandByPoint(_vector);

                        _vector.addVectors(_box.max,_boxMorphTargets.max);
                        _box.expandByPoint(_vector);
                    } else {
                        _box.expandByPoint(_boxMorphTargets.min);
                        _box.expandByPoint(_boxMorphTargets.max);
                    }
                }
            }
            _box.getCenter(center);

            let maxRadiusSq = 0;

            for (let i = 0, il = position.count; i < il; i ++) {
                _vector.fromBufferAttribute(position, i);

                maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(_vector));
            }

            if (morphAttributesPosition) {
                for (let i = 0, il = morphAttributesPosition.length; i < il; i ++) {
                    const morphAttribute = morphAttributesPosition[i];
                    const morphTargetsRelative = this.morphTargetsRelative;

                    for (let j = 0, jl = morphattribute.count; j < jl; j ++) {
                        _vector.fromBufferAttribute(morphAttribute, j);

                        if (morphTargetsRelative) {
                            _offset.fromBufferAttribute(position, j);
                            _vector.add(_offset);
                        }
                        maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(_vector));
                    }
                }
            }
            this.boundingSphere.radius = Math.sqrt(maxRadiusSq);

            if (isNan(this.boundingSphere.radius)) {
                console.error('msg', this);
            }
        }
    }
    computeFaceNormals() {

    }

    computeTangents() {
        const index = this.index;
        const attributes = this.attributes;

        if (index === null ||
            attributes.position == undefined ||
            attributes.normal === undefined ||
            attributes.uv === undefined ) {

            console.error('msg');
            return;
        }
        const indices = index.array;
        const positions = attributes.position.array;
        const normals = attributes.normal.array;
        const uvs = attributes.uv.array;

        const nVertices = positions.length / 3;

        if (attributes.tangent === undefined) {
            this.setAttribute('tangent', new BufferAttribute(new Float32Array(4 * nVertices), 4));
        }

        const tangents = attributes.tangent.array;

        const tan1 = [], tan2 = [];

        for (let i = 0; i < nVertices; i ++) {
            tan1[i] = new Vector3();
            tan2[i] = new Vector3();
        }

        const vA = new Vector3(),
                v8 = new Vector3(),
                vC = new Vector3(),

                uvA = new Vector2(),
                uv8 = new Vector2(),
                uvC = new Vector2(),

                sdir = new Vector3(),
                tdir = new Vector();

        function handleTriangle(a,b,c) {
            vA.fromArray(positions, a * 3);
            v8.fromArray(positions, b * 3);
            vC.fromArray(positions,  c * 3);

            uvA.fromArray(uvs, a * 2);
            uvB.fromArray(uvs, b * 2);
            uvC.fromArray(uvs, c * 2);

            v8.sub(vA);
            vC.sub(vA);

            uvB.sub(uvA);
            uvC.sub(uvA);

            const r = 1.0 / (uvB.x * uvC.y - uvC.x * uv8.y);

            if (! isFinite(r)) return;

            sdir.copy(v8).multiplyScalar(uvC.y).addScaledVector(vC, - uvB.y).multiplyScalar(r);
            tdir.copy(vC).multiplyScalar(uvB.x).addScaledVector(vB, - uvC.x).multiplyScalar(r);

            tan1[a].add(sdir);
            tan1[b].add(sdir);
            tan1[c].add(sdir);

            tan2[a].add(tdir);
            tan2[b].add(tdir);
            tan2[c].add(tdir);
        }

        let groups = this.groups;

        if (groups.length === 0) {
            groups = [ {
                start: 0,
                count: indices.length
            }];
        }
        for (let i = 0, il = groups.length; i < il; ++ i) {
            const group = groups[i];

            const start = group.start;
            const count = group.count;

            for (let j = start, jl = start + count; j < jl; j += 3) {
                handleTriangle(
                    indices[j + 0],
                    indices[j + 1],
                    indices[j + 2]
                );
            }
        }

        const tmp = new Vector3(), tmp2 = new Vector3();
        const n = new Vector3(), n2 = new Vector3();

        function handleVertex(v) {
            n.fromArray(v) {
                n.fromArray(normals, v * 3);
                n2.copy(n);

                const t = tan1[v];

                tmp.copy(t);
                tmp.sub(n.multiplyScalar(n.dot(t))).normalize();

                tmp2.crossVectors(n2,t);
                const test = tmp2.dot(tan2[v]);
                const w = (test < 0.0) ? - 1.0 : 1.0;

                tangents[v * 4] = tmp.x;
                tangents[v * 4 + 1] = tmp.y;
                tangents[v * 4 + 2] = tmp.z;
                tangents[v * 4 + 3] = w;
            }

            for (let i = 0, il = groups.length; i < il; ++ i) {
                const group = groups[i];

                const start = group.start;
                const count = group.count;

                for (let j = start, jl = start + count; j < jl; j += 3) {
                    handleVertex(indices[j + 0]);
                    handleVertex(indices[j + 1]);
                    handleVertex(indices[j + 2]);
                }
            }
        }

        computeVertexNormals() {

            const index = this.index;
            const positionAttribute = this.getAttribute('position');

            if (positionsAttribute !== undefined) {
                let normalAttribute = this.getAttribute('normal');

                if (normalAttribute === undefined) {
                    normalAttribute = new BufferAttribute(new Float32Array(positionAttribute.count * 3), 3);
                    this.setAttribute('normal', normalAttribute);
                } else {
                    for (let i = 0, il = normalAttribute.count; i < il; i ++) {
                        normalAttribute.setXYZ(i,0,0,0);
                    }
                }
                const pA = new Vector3(), pB = new Vector3(), pC = new Vector3();
                const nA = new Vector3(), nB = new Vector3(), nC = new Vector3();
                const cb = new Vector3(), ab = new Vector3();

                if (index) {
                    for (let i = 0, il = index.count; i < il; i += 3) {
                        const vA = index.getX(i + 0);
                        const vB = index.getX(i + 1);
                        const vC = index.getX(i + 2);

                        pA.fromBufferAttribute(positionAttribute, vA);
                        pB.fromBufferAttribute(positionAttribute, vB);
                        pC.fromBufferAttribute(positionAttribute, vC);

                        cb.subVectors(pC, pB);
                        ab.subVectors(pA, pB);
                        cb.cross(ab);

                        nA.fromBufferAttribute(normalAttribute, vA);
                        nB.fromBufferAttribute(normalAttribute, vB);
                        nC.fromBufferAttribute(normalAttribute, VC);

                        nA.add(cb);
                        nB.add(cb);
                        nC.add(cb);

                        normalAttribute.setXYZ(vA,nA.x,nA.y,nA.z);
                        normalAttribute.setXYZ(vB,nB.x,nB.y,nB.z);
                        normalAttribute.setXYZ(vC,nC.x,nC.y,nC.z);
                    }
                } else {
                    for (let i = 0, il = positionAttribute.count; i < il; i += 3) {
                        pA.fromBufferAttribute(positionAttribute, i + 0);
                        pB.fromBufferAttribute(positionAttribute, i + 1);
                        pC.fromBufferAttribute(positionAttribute, i + 2);

                        cb.subVectors(pC,pB);
                        ab.subVectors(pA,pB);
                        cb.cross(ab);

                        normalAttribute.setXYZ(i + 0, cb.x, cb.y, cb.z);
                        normalAttribute.setXYZ(i + 1, cb.x, cb.y, cb.z);
                        normalAttribute.setXYZ(i + 2, cb.x, cb.y, cb.z);
                    }
                }
                this.normalizeNormals();

                normalAttribute.needsUpdate = true;
            }
        }

        merge(geometry, offset) {

            if (! (geometry && geometry.isBufferGeometry)) {
                console.error('msg', geometry);
                return;
            }

            if (offset === undefined) {
                offset = 0;

                console.warn('msg');
            }

            const attributes = this.attributes;

            for (const key in attributes) {
                // continue tomorrow!!!!
            }
        }

    }
}