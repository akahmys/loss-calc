import { IsoPoint3D, IsoPoint2D, OrientationPlane, IsoViewType } from '../types/iso';

export const ISO_VIEW_ANGLES: Record<IsoViewType, number> = {
  IS1_SW: 30,
  IS2_SE: 120,
  IS3_NE: 210,
  IS4_NW: 300,
};

/**
 * Transforms 3D coordinate P(X, Y, Z) to 2D Screen Coordinate p(px, py).
 */
export function project3DToIso2D(
  point: IsoPoint3D,
  thetaDeg: number,
  scale: number,
  origin: IsoPoint2D
): IsoPoint2D {
  const thetaRad = (thetaDeg * Math.PI) / 180;
  const sin30 = 0.5;

  const px = (point.x * Math.cos(thetaRad) - point.y * Math.sin(thetaRad)) * scale + origin.x;
  const py =
    (point.x * Math.sin(thetaRad) + point.y * Math.cos(thetaRad)) * sin30 * scale -
    point.z * scale +
    origin.y;

  return { x: px, y: py };
}

export function computeDepth(point: IsoPoint3D, thetaDeg: number): number {
  const thetaRad = (thetaDeg * Math.PI) / 180;
  const cos30 = 0.8660254037844386;
  return point.x * Math.sin(thetaRad) - point.y * Math.cos(thetaRad) + point.z * cos30;
}

export function getAffineMatrixForPlane(plane: OrientationPlane): [number, number, number, number, number, number] {
  const cos30 = 0.8660254037844386;
  const sin30 = 0.5;

  switch (plane) {
    case 'XY':
      return [cos30, sin30, -cos30, sin30, 0, 0];
    case 'YZ':
      return [cos30, sin30, 0, -1.0, 0, 0];
    case 'XZ':
      return [-cos30, sin30, 0, -1.0, 0, 0];
  }
}

/**
 * Check if a 3D line segment is skewed (not aligned with any single principal axis X, Y, or Z).
 */
export function isSkewedSegment(p1: IsoPoint3D, p2: IsoPoint3D): boolean {
  const dx = Math.abs(p2.x - p1.x);
  const dy = Math.abs(p2.y - p1.y);
  const dz = Math.abs(p2.z - p1.z);

  const nonZeroCount = (dx > 1e-3 ? 1 : 0) + (dy > 1e-3 ? 1 : 0) + (dz > 1e-3 ? 1 : 0);
  return nonZeroCount > 1; // Skewed if moving along 2 or 3 axes simultaneously
}

/**
 * Generate offset box triangular corner points and louvre hatching lines for skewed isometric piping.
 */
export interface LouvreHatchData {
  cornerPoints2D: IsoPoint2D[]; // 2D points forming the bounding triangle/box
  hatchLines2D: Array<{ p1: IsoPoint2D; p2: IsoPoint2D }>; // Hatching lines inside offset box
  deltaText: { dx: number; dy: number; dz: number };
}

export function computeOffsetBoxAndLouvre(
  start3D: IsoPoint3D,
  end3D: IsoPoint3D,
  thetaDeg: number,
  scale: number,
  origin: IsoPoint2D,
  hatchCount: number = 6
): LouvreHatchData {
  // Intermediate 3D point projecting onto horizontal plane (X-Y movement first, then Z)
  const corner3D: IsoPoint3D = {
    x: end3D.x,
    y: end3D.y,
    z: start3D.z,
  };

  const pStart2D = project3DToIso2D(start3D, thetaDeg, scale, origin);
  const pEnd2D = project3DToIso2D(end3D, thetaDeg, scale, origin);
  const pCorner2D = project3DToIso2D(corner3D, thetaDeg, scale, origin);

  const hatchLines2D: Array<{ p1: IsoPoint2D; p2: IsoPoint2D }> = [];

  // Generate parallel louvre hatching lines along the offset triangle
  for (let i = 1; i <= hatchCount; i++) {
    const t = i / (hatchCount + 1);
    // Interpolate along base line (Start -> Corner)
    const baseP: IsoPoint2D = {
      x: pStart2D.x + t * (pCorner2D.x - pStart2D.x),
      y: pStart2D.y + t * (pCorner2D.y - pStart2D.y),
    };
    // Interpolate along hypotenuse line (Start -> End)
    const hypoP: IsoPoint2D = {
      x: pStart2D.x + t * (pEnd2D.x - pStart2D.x),
      y: pStart2D.y + t * (pEnd2D.y - pStart2D.y),
    };

    hatchLines2D.push({ p1: baseP, p2: hypoP });
  }

  return {
    cornerPoints2D: [pStart2D, pCorner2D, pEnd2D],
    hatchLines2D,
    deltaText: {
      dx: Math.round(end3D.x - start3D.x),
      dy: Math.round(end3D.y - start3D.y),
      dz: Math.round(end3D.z - start3D.z),
    },
  };
}
