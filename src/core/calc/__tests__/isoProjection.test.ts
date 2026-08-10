import { describe, it, expect } from 'vitest';
import {
  project3DToIso2D,
  computeDepth,
  getAffineMatrixForPlane,
  ISO_VIEW_ANGLES,
} from '../isoProjection';

describe('isoProjection engine tests', () => {
  it('correctly projects 3D origin point (0,0,0) to 2D origin offset', () => {
    const p3d = { x: 0, y: 0, z: 0 };
    const origin = { x: 400, y: 300 };
    const p2d = project3DToIso2D(p3d, 30, 1.0, origin);
    expect(p2d.x).toBeCloseTo(400);
    expect(p2d.y).toBeCloseTo(300);
  });

  it('correctly shifts vertical Z axis linearly on 2D Y axis', () => {
    const p3d = { x: 0, y: 0, z: 100 };
    const origin = { x: 0, y: 0 };
    const p2d = project3DToIso2D(p3d, 30, 1.0, origin);
    expect(p2d.x).toBeCloseTo(0);
    expect(p2d.y).toBeCloseTo(-100);
  });

  it('computes Z-depth for SW front view (theta=30deg)', () => {
    const frontPoint = { x: 100, y: 0, z: 0 };
    const backPoint = { x: 0, y: 100, z: 0 };

    const depthFront = computeDepth(frontPoint, ISO_VIEW_ANGLES.IS1_SW);
    const depthBack = computeDepth(backPoint, ISO_VIEW_ANGLES.IS1_SW);

    expect(depthFront).toBeGreaterThan(depthBack);
  });

  it('returns valid JIS affine matrices for top, right, left planes', () => {
    const topMatrix = getAffineMatrixForPlane('XY');
    expect(topMatrix[0]).toBeCloseTo(0.866, 3);
    expect(topMatrix[1]).toBeCloseTo(0.5, 3);
    expect(topMatrix[2]).toBeCloseTo(-0.866, 3);
    expect(topMatrix[3]).toBeCloseTo(0.5, 3);

    const rightMatrix = getAffineMatrixForPlane('YZ');
    expect(rightMatrix[0]).toBeCloseTo(0.866, 3);
    expect(rightMatrix[3]).toBeCloseTo(-1.0, 3);

    const leftMatrix = getAffineMatrixForPlane('XZ');
    expect(leftMatrix[0]).toBeCloseTo(-0.866, 3);
    expect(leftMatrix[3]).toBeCloseTo(-1.0, 3);
  });
});
