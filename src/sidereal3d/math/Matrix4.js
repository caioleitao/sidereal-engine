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

        }
    }

}