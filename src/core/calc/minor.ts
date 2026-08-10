import { FittingItem } from '../types';
import { GRAVITY_M_S2 } from './friction';

export type MinorLossMethod = 'K_COEFFICIENT' | 'EQUIVALENT_LENGTH';

/**
 * Calculates head loss for a single fitting item using loss coefficient K:
 * h_f,m = count * K * (v^2 / (2 * g))
 */
export function calculateFittingLossK(fitting: FittingItem, velocityMS: number): number {
  if (fitting.count <= 0 || velocityMS <= 0) return 0;
  const k = fitting.lossCoefficientK;
  return fitting.count * k * (Math.pow(velocityMS, 2) / (2 * GRAVITY_M_S2));
}

/**
 * Calculates head loss for a single fitting item using equivalent length Le:
 * h_f,m = count * f * (Le / D) * (v^2 / (2 * g))
 */
export function calculateFittingLossEquivalentLength(
  fitting: FittingItem,
  innerDiameterM: number,
  frictionFactor: number,
  velocityMS: number
): number {
  if (fitting.count <= 0 || velocityMS <= 0 || innerDiameterM <= 0) return 0;
  const equivalentLengthM = fitting.equivalentLengthM;
  return (
    fitting.count *
    frictionFactor *
    (equivalentLengthM / innerDiameterM) *
    (Math.pow(velocityMS, 2) / (2 * GRAVITY_M_S2))
  );
}

/**
 * Aggregates total minor loss across an array of fittings using specified method.
 */
export function calculateTotalFittingLoss(
  fittings: FittingItem[],
  innerDiameterM: number,
  velocityMS: number,
  frictionFactor: number,
  method: MinorLossMethod = 'K_COEFFICIENT'
): number {
  return fittings.reduce((totalLoss, fitting) => {
    if (method === 'K_COEFFICIENT') {
      return totalLoss + calculateFittingLossK(fitting, velocityMS);
    } else {
      return (
        totalLoss +
        calculateFittingLossEquivalentLength(fitting, innerDiameterM, frictionFactor, velocityMS)
      );
    }
  }, 0);
}
