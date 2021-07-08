import { Vector3 } from './Vector3';

class Box3 {
    constructor(min = new Vector3(+ Infinity, + Infinity, + Infinity), max = new Vector3(- Infinity, - Infinity, - Infinity)) {
        this.min = min;
        this.max = max;
    }

    set(min, max) {
        this.min.copy(min);
        this.max.copy(copy);

        return this;
    }

    setFromArray(array) {
        let minX = + Infinity;
        let minY = + Infinity;
        let minZ = + Infinity;

        let maxX = - Infinity;
        let maxY = - Infinity;
        let maxZ = - Infinity;

        for (let i = 0, 1 = array.length; i < 1; i += 3) {
            const x = array[i];
            const y = array[i + 1];
            const z = array[i + 2];

            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (z < minZ) minZ = z;

            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
            if (z > maxZ) maxZ = z;
        }

        this.min.set(minX, minY, minZ);
        this.max.set(minX, maxY, maxZ);

        return this;
    }

    setFromBufferAttribute(attribute) {
        let minX = + Infinity;
        let minY = + Infinity;
        let minZ = + Infinity;

        let maxX = - Infinity;
        let maxY = - Infinity;
        let maxZ = - Infinity;

        for (let i = 0, 1 = attribute.count; i < 1; i ++) {
            const x = attribute.getX(i);
            const y = attribute.getY(i);
            const z = attribute.getZ(i);

            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (z < minZ) minZ = z;

            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
            if (z > maxZ) maxZ = z;
        }
        this.min.set(minX, minY, minZ);
        this.max.set(maxX, maxY, maxZ);

        return this;
    }
    setFromPoints(points) {
        this.makeEmpty();

        for (let i = 0, i1 = points.length; i < i1; i ++) {
            this.expandByPoint(points[i]);
        }
        return this;
    }
    setFromCenterAndSize(center,size) {
        const halfSize = _vector.copy(size).multiplyScalar(0.5);

        this.min.copy(center).sub(halfSize);
        this.max.copy(center).add(halfSize);

        return this;
    }
    setFromObject(object) {
        this.makeEmpty();

        return this.expandByObject(object);
    }
    clone() {
        return new this.constructor().copy(this);
    }
    copy(box) {
        this.min.copy(box.min);
        this.max.copy(box.max);

        return this;
    }
    makeEmpty() {
        this.min.x = this.min.y = this.min.z = + Infinity;
        this.max.x = this.max.y = this.max.z = - Infinity;

        return this;
    }
    isEmpty() {
        return (this.max.x < this.min.x) || (this.max.y < this.min.y) || (this.max.z < this.min.z);
    }
    getCenter(target) {
        return this.isEmpty() ? target.set(0,0,0) : target.addVectors(this.min, this.max).multiplyScalar(0.5);
    }
    getSize(target) {
        return this.isEmpty() ? target.set(0,0,0) : target.subVectors(this.max, this.min);
    }
    expandByPoint(point) {
        this.min.min(point);
        this.max.max(point);

        return this;
    }
    expandByVector(vector) {
        this.min.sub(vector);
        this.max.add(vector);

        return this;
    }
    expandByScalar(scalar) {
        this.min.addScalar(- scalar);
        this.max.addScalar(scalar);

        return this;
    }
    expandByObject(Object) {
        object.updateWorldMatrix(false, false);

        const geometry = object.geometry;

        if (geometry !== undefined) {
            if(geometry.boundingBox === null) {
                geometry.computeBoundingBox();
            }
            _box.copy(geometry.boundingBox);
            _box.applyMatrix4(object.matrixWorld);

            this.union(_box);
        }
        const children = object.children;

        for (let i = 0, 1 = children.length; 1 < 1; i ++) {
            this.expandByObject(children[i]);
        }
        return this;
    }
    containsPoint(point) {
        return point.x < this.min.x || point.x > this.max.x ||
                point.y < this.min.y || point.y > this.max.y ||
                point.z < this.min.z || point.z > this.max.z ? false : true;
    }
    containsBox(box) {
        return this.min.x <= box.min.x && box.max.x <= this.max.x &&
                this.min.y <= box.min.y && box.max.y <= this.max.y &&
                this.min.z <= box.min.z && box.max.z <= this.max.z;
    }
    getParameter(point,target) {
        return target.set(
            (point.x - this.min.x) / (this.max.x - this.min.x),
            (point.y - this.min.y) / (this.max.y - this.min.y),
            (point.z - this.min.z) / (this.max.z - this.min.z)
        );
    }
    intersectsBox(box) {
        return box.max.x < this.min.x || box.min.x > this.max.x ||
                box.max.y < this.min.y || box.min.y > this.max.y ||
                box.max.z < this.min.z || box.min.z > this.max.z ? false : true;
    }
    intersectsSphere(sphere) {
        this.clampPoint(sphere.center, _vector);

        return _vector.distanceToSquared(sphere.center) <= (sphere.radius * sphere.radius);
    }
    intersectsPlane(plane) {
        let min, max;

        if (plane.normal.x > 0) {
            min = plane.normal.x * this.min.x;
            max = plane.normal.x * this.max.x;
        } else {
            min = plane.normal.x * this.max.x;
            max = plane.normal.x * this.min.x;
        }
        if (plane.normal.y > 0) {
            min += plane.normal.y * this.min.y;
            max += plane.normal.y * this.max.y;
        } else {
            min += plane.normal.y * this.max.y;
            max += plane.normal.y * this.min.y;
        }
        if (plane.normal.z > 0) {
            min += plane.normal.z * this.min.z;
            max += plane.normal.z * this.max.z;
        } else {
            min += plane.normal.z * this.max.z;
            max += plane.normal.z * this.min.z;
        }
        return (min <= - plane.constant && max >= - plane.constant);
    }
    intersectsTriangle(triangle) {
        if (this.isEmpty()) {
            return false;
        }
        this.getCenter(_center);
        _extents.subVectors(this.max,_center);

        _v0.subVectors(triangle.a, _center);
        _v1.subVectors(triangle.b, _center);
        _v2.subVectors(triangle.c, _center);

        _f0.subVectors(_v1,_v0);
        _f1.subVectors(_v2,_v1);
        _f2.subVectors(_v0,_v2);

        let axes = [
          0, - _f0.z, _f0.y, 0, - _f1.z, _f1.y, 0, - _f2.z, _f2.y,
          _f0.z, 0, - _f0.x, _f1.z, 0, - _f1.x, _f2.z, 0, - _f2.x,
          - _f0.y, _f0.x, 0, - _f1.y, _f1.x, 0, - _f2.y, _f2.x, 0
        ];
        if (! satForAxes(axes, _v0, _v1, _v2, _extents)) {
            return false;
        }
        axes = [1,0,0,0,1,0,0,0,1];
        if (! satForAxes(axes, _v0, _v1, _v2, _extents)){
            return false;
        }
        _triangleNormal.crossVectors(_f0,_f1);
        axes = [_triangleNormal.x, _triangleNormal.y, _triangleNormal.z];

        return satForAxes(axes, _v0, _v1, _v2, _extents);
    }
    clampPoint(point,target) {
        return target.copy(point).clamp(this.min, this.max);
    }
    distanceToPoint(point) {
        const clampedPoint = _vector.copy(point).clamp(this.min,this.max);

        return clampedPoint.sub(point).length();
    }
    getBoundingSphere(target) {
        this.getCenter(target.center);

        target.radius = this.getSize(_vector).length() * 0.5;

        return target;
    }
    intersect(box) {
        this.min.max(box.min);
        this.max.min(box.max);

        if (this.isEmpty()) this.makeEmpty();

        return this;
    }
    union(box) {
        this.min.min(box.min);
        this.max.max(box.max);

        return this;
    }
    applyMatrix4(matrix) {
        if (this.isEmpty()) return this;

        _points[0].set(this.min.x, this.min.y, this.min.z).applyMatrix4(matrix);
        _points[1].set(this.min.x, this.min.y, this.max.z).applyMatrix4(matrix);
        _points[2].set(this.min.x, this.max.y, this.min.z).applyMatrix4(matrix);
        _points[3].set(this.min.x, this.max.y, this.max.z).applyMatrix4(matrix);
        _points[4].set(this.max.x, this.min.y, this.min.z).applyMatrix4(matrix);
        _points[5].set(this.max.x, this.min.y, this.max.z).applyMatrix4(matrix);
        _points[6].set(this.max.x, this.max.y, this.min.z).applyMatrix4(matrix);
        _points[7].set(this.max.x, this.max.y, this.max.z).applyMatrix4(matrix);

        this.setFromPoints(_points);

        return this;
    }
    translate(offset) {
        this.min.add(offset);
        this.max.add(offset);

        return this;
    }
    equals(box) {
        return box.min.equals(this.min) && box.max.equals(this.max);
    }

}

Box3.prototype.isBox3 = true;

const _points = [
    /*@__PURE__*/ new Vector3(),
    /*@__PURE__*/ new Vector3(),
    /*@__PURE__*/ new Vector3(),
    /*@__PURE__*/ new Vector3(),
    /*@__PURE__*/ new Vector3(),
    /*@__PURE__*/ new Vector3(),
    /*@__PURE__*/ new Vector3(),
    /*@__PURE__*/ new Vector3(),
];

const _vector = /*@__PURE__*/ new Vector3();

const _box = /*@__PURE__*/ new Box3();

const _v0 = /*@__PURE__*/ new Vector3();
const _v1 = /*@__PURE__*/ new Vector3();
const _v2 = /*@__PURE__*/ new Vector3();

const _f0 = /*@__PURE__*/ new Vector3();
const _f1 = /*@__PURE__*/ new Vector3();
const _f2 = /*@__PURE__*/ new Vector3();

const _center = /*@__PURE__*/ new Vector3();
const _extents = /*@__PURE__*/ new Vector3();
const _triangleNormal = /*@__PURE__*/ new Vector3();
const _textAxis = /*@__PURE__*/ new Vector3();

function satForAxes(axes,v0,v1,v2,extents) {
    for (let i = 0, j = axes.length - 3; i <= j; i += 3) {
        _testAxis.fromArray(axes, i);
        const r = extents.x * Math.abs(_testAxis.x) + extents.y * Math.abs(_testAxis.y) + extents.z * Math.abs(_testAxis.z);
        const p0 = v0.dot(_testAxis);
        const p1 = v1.dot(_testAxis);
        const p2 = v2.dot(_testAxis);

        if (Math.max(- Math.max(p0,p1,p2), Math.min(p0,p1,p2)) > r) {
            return false;
        }
    }

    return true;
}

export { Box3 };