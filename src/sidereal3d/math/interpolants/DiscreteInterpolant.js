import { Interpolant } from '../Interpolant.js';

class DiscreteInterpolant extends Interpolant {
    constructor(parameterPositions, sampleValues, sampleSize, resultBuffer) {
        super(parameterPositions, sampleValues, sampleSize, resultBuffer);
    }

    interpolate_(i1) {
        return this.copySampleValue_(i1 - 1);
    }
}

export { DiscreteInterpolant };