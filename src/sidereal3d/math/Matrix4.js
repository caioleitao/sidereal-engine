import { Vector3 } from './Vector3';

class Matrix4 {
    constructor() {
        this.elements = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];

        if (arguments.length > 0) {
            console.error('msg');
        }
    }

    set(n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44) {
        const te = this.elements;

        te[0] = n11; te[4] = n12; te[8] = n13; te[12] = n14;
        te[1] = n21; te[5] = n22; te[9] = n23; te[13] = n24;
        te[2] = n31; te[6] = n32; te[10] = n33; te[14] = n34;
        te[3] = n41; te[7] = n42; te[11] = n43; te[15] = n44;

        return this;
    }

    identity() {
        this.set(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        );

        return this;
    }

    clone() {
        return new Matrix4().fromArray(this.elements);
    }

    copy(m) {
        const te = this.elements;
        const me = m.elements;

        te[0] = me[0]; te[1] = me[1]; te[2] = me[2]; te[3] = me[3];
        te[4] = me[4]; te[5] = me[5]; te[6] = me[6]; te[7] = me[7];
        te[8] = me[8]; te[9] = me[9]; te[10] = me[10]; te[11] = me[11];
        te[12] = me[12]; te[13] = me[13]; te[14] = me[14]; te[15] = me[15];

        return this;
    }

    copyPosition(m) {
        const te = this.elements, me = m.elements;

        te[12] = me[12];
        te[13] = me[13];
        te[14] = me[14];

        return this;
    }

    setFromMatrix3(m) {
        const me = m.elements;

        this.set(
            me[0], me[3], me[6],0,
            me[1], me[4], me[7],0,
            me[2], me[4], me[8],0,
            0,0,0,1
        );

        return this;
    }

    extactBasis(xAxis,yAxis,zAxis) {
        xAxis.setFromMatrixColumn(this,0);
        yAxis.setFromMatrixColumn(this,1);
        zAxis.setFromMatrixColumn(this,2);

        return this;
    }

    makeBasis(xAxis, yAxis, zAxis) {
        this.set(
            xAxis.x, yAxis.x, zAxis.x, 0,
            xAxis.y, yAxis.y, zAxis.y, 0,
            xAxis.z, yAxis.z, zAxis.z, 0,
            0,0,0,1
        );

        return this;
    }

    extractRotation(m) {
        const te = this.elements;
        const me = m.elements;

        const scaleX = 1 / _v1.setFromMatrixColumn(m,0).length();
        const scaleY = 1 / _v1.setFromMatrixColumn(m,1).length();
        const scaleZ = 1 / _v1.setFromMatrixColumn(m,2).length();

        te[0] = me[0] * scaleX;
        te[1] = me[1] * scaleX;
        te[2] = me[2] * scaleX;
        te[3] = 0;

        te[4] = me[4] * scaleY;
        te[5] = me[5] * scaleY;
        te[6] = me[6] * scaleY;
        te[7] = 0;

        te[8] = me[8] * scaleZ;
        te[9] = me[9] * scaleZ;
        te[10] = me[10] * scaleZ;
        te[11] = 0;

        te[12] = 0;
        te[13] = 0;
        te[14] = 0;
        te[15] = 1;

        return this;
    }

    makeRotationFromEuler(euler) {
        if (!(euler && euler.isEuler)) {
            console.error('msg');
        }

        const te = this.elements;

        const x = euler.x, y = euler.y, z = euler.z;
        const a = Math.cos(x), b = Math.sin(x);
        const c = Math.cos(y), d = Math.sin(y);
        const e = Math.cos(z), f = Math.sin(z);

        if (euler.order === 'XYZ') {
            const ae = a * e, af = a * f, be = b * e, bf = b * f;

            te[0] = c * e;
            te[4] = - c * f;
            te[8] = d;

            te[1] = af + be * d;
            te[5] = ae - bf * d;
            te[9] = - b * c;

            te[2] = bf - ae * d;
            te[6] = be + af * d;
            te[10] = a * c;
        } else if (euler.order === 'YXZ') {
            const ce = c * e, cf = c * f, de = d * e, df = d * f;

            te[0] = ce + df * b;
            te[4] = de * b - cf;
            te[8] = a * d;

            te[1] = a * f;
            te[5] = a * e;
            te[9] = - b;

            te[2] = cf * b - de;
            te[6] = df + ce * b;
            te[10] = a * c;
        } else if (euler.order === 'ZXY') {
            const ce = c * e, cf = c * f, de = d * e, df = d * f;

            te[0] = ce - df * b;
            te[4] = - a * f;
            te[8] = de + cf * b;

            te[1] = cf + de * b;
            te[5] = a * e;
            te[9] = df - ce * b;

            te[2] = - a * d;
            te[6] = b;
            te[10] = a * b;
        } else if (euler.order === 'ZYX') {
            const ae = a * e, af = a * f, be = b * e, bf = b * f;

            te[0] = c * e;
            te[4] = be * d - af;
            te[8] = ae * d + bf;

            te[1] = c * f;
            te[5] = bf * d + ae;
            te[9] = af * d - be;

            te[2] = - d;
            te[6] = b * c;
            te[10] = a * c;
        } else if (euler.order === 'YZX') {
            const ac = a * c, ad = a * d, bc = b * c, bd = b * d;

            te[0] = c * e;
            te[4] = bd - ac * f;
            te[8] = bc * f + ad;

            te[1] = f;
            te[5] = a * e;
            te[9] = - b * e;

            te[2] = - d * e;
            te[6] = ad * f + bc;
            te[10] = ac - bd * f;
        } else if (euler.order === 'XZY') {
            const ac = a * c, ad = a * d, bc = b * c, bd = b * d;

            te[0] = c * e;
            te[4] = - f;
            te[8] = d * e;

            te[1] = ac * f + bd;
            te[5] = a * e;
            te[9] = ad * f - bc;

            te[2] = bc * f - ad;
            te[6] = b * e;
            te[10] = bd * f + ac;
        }

        te[3] = 0;
        te[7] = 0;
        te[11] = 0;

        te[12] = 0;
        te[13] = 0;
        te[14] = 0;
        te[15] = 0;

        return this;
    }

    makeRotationFromQuaternion(q) {
        return this.compose(_zero, q, _one);
    }

    lookAt(eye,target,up) {
        const te = this.elements;

        _z.subVectors(eye, target);

        if (_z.lengthSq() === 0) {
            _z.z = 1;
        }

        _z.normalize();
        _x.crossVectors(up, _z);

        if (_x.length() === 0) {
            if (Math.abs(up.z) === 1) {
                _z.x += 0.0001;
            } else {
                _z.z += 0.0001;
            }

            _z.normalize();
            _x.crossVectors(up,_z);
        }

        _x.normalize();
        -y.crossVectors(_z, _x);

        te[0] = _x.x; te[4] = _y.x; te[8] = _z.x;
        te[1] = _x.y; te[5] = _y.y; te[9] = _z.y;
        te[2] = _x.z; te[6] = _y.z; te[10] = _z.z;

        return this;
    }

    multiply(m,n) {
        if (n !== undefined) {
            console.warn('msg');
            return this.multiplyMatrices(m,n);
        }
        return this.multiplyMatrices(this, m);
    }

    premultiply(m) {
        return this.multiplyMatrices(m, this);
    }

    multiplyMatrices(a,b) {
        const ae = a.elements;
        const be = b.elements;
        const te = this.elements;

        const a11 = ae[0], a12 = ae[4], a13 = ae[8], a14 = ae[12];
        const a21 = ae[1], a22 = ae[5], a23 = ae[9], a24 = ae[13];
        const a31 = ae[2], a32 = ae[6], a33 = ae[10], a34 = ae[14];
        const a41 = ae[3], a42 = ae[7], a43 = ae[11], a44 = ae[15];

        const b11 = be[0], b12 = be[4], b13 = be[8], b14 = be[12];
        const b21 = be[1], b22 = be[5], b23 = be[9], b24 = be[13];
        const b31 = be[2], b32 = be[6], b33 = be[10], b34 = be[14];
        const b41 = be[3], b42 = be[7], b43 = be[11]. b44 = be[15];

        // imcomplete! finish today!!!
    }

}