import { IsoViewType } from '../types/iso';

export const GRID_WIDTH = 60;
export const GRID_HEIGHT = 34.64101615137754; // 60 * tan(30°)

export const LEG1_LENGTH = 180; // Pipe length of Leg 1 (Start -> Elbow)
export const LEG2_LENGTH = 200; // Pipe length of Leg 2 (Elbow -> End)
export const CANVAS_CENTER = { x: 350, y: 320 };

export interface SinglePipeLineGeometry {
  pS: { x: number; y: number };
  pB: { x: number; y: number };
  pE: { x: number; y: number };
}

/**
 * Calculates 2D projected coordinates for a single-line isometric piping run.
 * @param viewMode The active perspective view mode
 * @param panOffsetX Additional horizontal panning offset in pixels
 * @param panOffsetY Additional vertical panning offset in pixels
 */
export function computeSingleIsoGeometry(
  viewMode: IsoViewType,
  panOffsetX: number = 0,
  panOffsetY: number = 0
): SinglePipeLineGeometry {
  const cos30 = 0.8660254037844386;
  const sin30 = 0.5;

  let pipeDx = 0;
  let pipeDy = 0;

  switch (viewMode) {
    case 'IS1_SW':
      pipeDx = LEG1_LENGTH * cos30;
      pipeDy = -LEG1_LENGTH * sin30;
      break;
    case 'IS2_SE':
      pipeDx = -LEG1_LENGTH * cos30;
      pipeDy = -LEG1_LENGTH * sin30;
      break;
    case 'IS3_NE':
      pipeDx = -LEG1_LENGTH * cos30;
      pipeDy = LEG1_LENGTH * sin30;
      break;
    case 'IS4_NW':
      pipeDx = LEG1_LENGTH * cos30;
      pipeDy = LEG1_LENGTH * sin30;
      break;
  }

  const centerWithPan = { x: CANVAS_CENTER.x + panOffsetX, y: CANVAS_CENTER.y + panOffsetY };

  // Calculate 2D Bounding Box Offset of Single Line Model to keep entire piping run centered
  const modelCenterXOffset = pipeDx / 2;
  const modelCenterYOffset = (pipeDy - LEG2_LENGTH) / 2;

  const originS = {
    x: centerWithPan.x - modelCenterXOffset,
    y: centerWithPan.y - modelCenterYOffset,
  };

  const pS = { x: originS.x, y: originS.y };
  const pB = { x: pS.x + pipeDx, y: pS.y + pipeDy };
  const pE = { x: pB.x, y: pB.y - LEG2_LENGTH };

  return { pS, pB, pE };
}
