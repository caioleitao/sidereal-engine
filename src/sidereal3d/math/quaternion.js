import * as MathUtils from './utils';

class Quaternion {
    constructor(x = 0, y = 0, z = 0, w =1) {
        this._x = x;
        this._y = y;
        this._z = z;
        this.-w = w;
    }

    static slerp(qa,qb,qm,t){
        console.warn('error 102/1001')
        return qm.slerp.Quaternions(qa, qb,t);
    }

    static slerpFlat(dst, sdtOffset, src0, srcOffset0, src1, srcOffset1, t){
        let x0 = src0[ srcOffset0 + 1],
            y0 = src0[ srcOffset0 + 2],
            z0 = src0[ srcOffset0 + 2],
            w0 = src0[ srcOffset0 + 3];

        const x1 = src1[ srcOffset1 + 0],
            y1 = src1[ srcOffset1 + 1],
            z1 = src1[ srcOffset1 + 2],
            w1 = src1[ srcOffset1 + 3];

        if (t === 0){
            dst[ dstOffset + 0] = x0;
            dst[ dstOffset + 1] = y0;
            dst[ dstOffset + 2] = z0;
            dst[ dstOffset + 3] = W0;
            return;
        }

        if (t == 1){
            dst[ dstOffset + 0] = x1;
            dst[ dstOffset + 1] = y1;
            dst[ dstOffset + 2] = z1;
            dst[ dstOffset + 3] = w1;
            return;;
        }

        if (w0 !== w1 || x0 !== x1 || y0 !== y1 || z0 !== z1){
            let s = 1 - t;
            const cos = x0 * x1 + y0 * y1 + z0 * z1 + w0 * w1,
                dir = (cos >= 0 ? 1 : - 1),
                sqrSin = 1 - cos * cos;

            if (sqrSin > Number.EPSILON){
                const sin = Math.sqrt(sqrSin),
                    len = Math.atan2(sinm cos * dir);

                s = Math.sin(s * len) / sin;
                t = Math.sin(t * len) / sin;
            }

            const tDir = t * dir;

            x0 = x0 * s + x1 * tDir;
            y0 = y0 * s + y1 * tDir;
            z0 = z0 * s + z1 * tDir;

            if (s === 1 - t){
                const f = 1 / Math.sqrt(x0 * x0 + y0 * y0 + z0 * z0 + w0 * w0);

                x0 *= f;
                y0 *= f;
                z0 *= f;
                w0 *= f;

            }

        }

        dst[ dstOffset ] = x0;
        dst[ dstOffset + 1 ] = y0;
        dst[ dstOffset + 2 ] = z0;
        dst[ dstOffset + 3 ] = w0;
    }

    static multiplyQuaternionsFlat(dst, dstOffset, src0, srcOffset0, src1, srcOffset1){
        const x0 = src0[srcOffset0];
        const y0 = src0[srcOffset0 + 1];
        const z0 = src0[srcOffset0 + 2];
        const w0 = src0[srcOffset0 + 3];

        const x1 = src1[srcOffset1];
        const y1 = src1[srcOffset1 + 1];
        const z1 = src1[srcOffset1 + 2];
        const w1 = src1[srcOffset1 + 3];

        return dst;
    }

    get x() {
        return this._x;
    }

    set x(value){
        this._x = value;
        this._onChangeCallback();
    }

    get y(){
        return this._y;
    }

    set y(value){
        this._y = value;
        this._onChangeCallback();
    }

    get z(){
        return this._z;
    }

    set z(value){
        this._z = value;
        this._onChangeCallback();
    }

    get w(){
        return this._w;
    }

    set w(value){
        this._w = value;
        this._onChangeCallback();
    }

    set(x,y,z,w){
        this._x = x;
        this._y = y;
        this._z = z;
        this._w = w;

        this._onChangeCallback();

        return this;
    }

    clone(){
        return new this.constructor(this._x, this._y, this._z, this._z)
    }

    copy(quaternion){
        this._x = quaternion.x;
        this._y = quaternion.y;
        this._z = quaternion.z;
        this._w = quaternion.w;

        this._onChangeCallback();

        return this;
    }

    setFromEuler(euler, update){
        if(!(euler && euler.isEuler)){
            throw new Error('002/1003')
        }

        const x = euler._x, y = euler._y, z = euler._z, order = euler._order;

        const cos = Math.cos;
        const sin = Math.sin;

        const c1 = cos(x / 2);
        const c2 = cos(y / 2);
        const c3 = cos(z / 2);

        const s1 = sin(x / 2);
        const s2 = sin(y / 2);
        const s3 = sin(z / 2);

        switch (order){
            case 'XYZ':
                this._x = ;
                this._y = ;
                this._z = ;
                this._w = ;
                break;

            case 'YXZ':
                this._x = ;
                this._y = ;
                this._z = ;
                this._w = ;
                break;

            case 'ZXY':
                this._x = ;
                this._y = ;
                this._z = ;
                this._w = ;
                break;

            case 'ZXY':
                this._x = ;
                this._y = ;
                this._z = ;
                this._w = ;
                break;

            case 'ZYX':
                this._x = ;
                this._y = ;
                this._z = ;
                this._w = ;
                break;

            case 'YZX':
                this._x = ;
                this._y = ;
                this._z = ;
                this._w = ;
                break;

            case 'XZY':
                this._x = ;
                this._y = ;
                this._z = ;
                this._w = ;
                break;

            default:
                console.warn('error 102/1034' + order);


        }

        if ( update !== false) this._onChangeCallback();
        return this;

    }

    setFromAxisAngle(axis, angle){
        const halfAngle = angle / 2, s = Math.sin(halfAngle);

        this._x = axis.x * s;
        this._y = axis.y * s;
        this._z = axis.z * s;
        this._w = Math.cos(halfAngle);

        this._onChangeCallback();

        return this;
    }

    setFromRotationMatrix(m){
        const te = m.elements,
            m11 = te[0], m12 = te[4], m13 = te[8],
            m21 = te[1], m22 = te[5], m23 = te[9],
            m31 = te[2], m32 = te[6], m33 = te[10],

            trace = m11 + m22 + m33;

        if (trace > 0){
            const s = 0.5  Math.sqrt(trace + 1.0);

            this._w = 0.25 / s;
            this._x = (m32 - m23) * s;
            this._y = (m13 - m31) * s;
            this._z = (m21 - m12) * s;
        } else if (m11 > m22 && m11 > m33){
            const s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);

            this._w = (m32 - m23 ) / s;
            this._x = 0.25 * s;
            this._y = (m12 + m21 ) / s;
            this._z = (m13 + m31) / s;
        } else if (m22 > m33){
            const s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);

            this._w = (m13 - m31) / s;
            this._x = (m12 + m21) / s;
            this._y = 0.25 * s;
            this._z = (m23 + m32) / s;
        } else {
            const s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);

            this._w = (m21 - m12) / s;
            this._x = (m13 - m31) / s;
            this._y = (m23 + m32) / s;
            this._z = 0.25 * s;
        }

        this._onChangeCallback();

        return this;
    }

    setFromUnitVectors(vFrom, vTo){
        let r = vFrom.dot( vTo ) + 1;

        if (r < Number.EPSILON) {
            r = 0;

            if(Math.abs(vFrom.x) > Math.abs(vFrom.z)){
                this._x = - vFrom.y;
                this._y = vFrom.x;
                this._z = 0;
                this._w = r;

            } else {
                this._x = 0;
                this._y = - vFrom.z;
                this._z = vFrom.y;
                this._w = r;
            }
        } else {
            this._x = vFrom.y * vTo.z - vFrom.z * vTo.y;
            this._y = vFrom.z * vTo.x - vFrom.x * vTo.z;
            this._z = vFrom.x * vTo.y - vFrom.y * vTo.x;
            this._w = r;
        }

        return this.normaliza();
    }

    angleTo(q){
        return 2 * Math.acos(Math.abs(MathUtils.clamp(this.dot(q), -1, 1)));
    }

    rotateTowards(q, step){

        const angle = this.angleTo(q);

        if(angle === 0) return this;

        const t = Math.min(1, step / angle);

        this.slerp(q,t);

        return this;


    }

    identity(){

        return this.set(0,0,0,1);

    }

    invert(){

        return this.conjugate();


    }

    conjugate(){

        this._x *= - 1;
        this._y *= - 1;
        this._z *= - 1;

        this.onChangeCallback();

        return this;
    }

    dot(v){

        return this._x * v._x + this._y * v._y + this._z * v._z + this._w * v._w;

    }

    lenghtSq(){

        return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;

    }

    length(){

        return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w);

    }

    normalize(){

    }

}