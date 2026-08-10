import { PipeMaterial, FittingType } from '../types';

/**
 * Standard absolute pipe surface roughness epsilon (in meters)
 * Source: JSME / Hydraulic Handbook standard values
 */
export const PIPE_ROUGHNESS_M: Record<PipeMaterial, number> = {
  SGP: 0.000045,   // Carbon steel pipe (SGP/STPG) ~0.045 mm
  STPG: 0.000045,  // Carbon steel pipe for pressure service ~0.045 mm
  SUS: 0.000015,   // Stainless steel pipe ~0.015 mm
  VP: 0.0000015,   // PVC pipe ~0.0015 mm (smooth pipe)
};

/**
 * Standard Hazen-Williams friction coefficient C
 */
export const HAZEN_WILLIAMS_C: Record<PipeMaterial, number> = {
  SGP: 100,
  STPG: 100,
  SUS: 130,
  VP: 140,
};

export interface JisPipeDimension {
  nominalA: number;       // e.g. 50 for 50A
  nominalB: string;       // e.g. "2" for 2 inch
  outerDiameterMm: number;// Outer diameter (mm)
  wallThicknessMm: Record<PipeMaterial, number>; // Wall thickness per material (mm)
}

/**
 * Standard JIS pipe dimensions (15A to 300A)
 * Wall thickness values derived from standard schedules (SGP/STPG Sch40/SUS Sch20S/VP)
 */
export const JIS_PIPE_DIMENSIONS: JisPipeDimension[] = [
  { nominalA: 15, nominalB: '1/2', outerDiameterMm: 21.7, wallThicknessMm: { SGP: 2.8, STPG: 2.8, SUS: 2.1, VP: 3.0 } },
  { nominalA: 20, nominalB: '3/4', outerDiameterMm: 27.2, wallThicknessMm: { SGP: 2.8, STPG: 2.8, SUS: 2.1, VP: 3.0 } },
  { nominalA: 25, nominalB: '1', outerDiameterMm: 34.0, wallThicknessMm: { SGP: 3.2, STPG: 3.2, SUS: 2.8, VP: 3.0 } },
  { nominalA: 32, nominalB: '1-1/4', outerDiameterMm: 42.7, wallThicknessMm: { SGP: 3.5, STPG: 3.5, SUS: 2.8, VP: 3.5 } },
  { nominalA: 40, nominalB: '1-1/2', outerDiameterMm: 48.6, wallThicknessMm: { SGP: 3.5, STPG: 3.5, SUS: 2.8, VP: 4.0 } },
  { nominalA: 50, nominalB: '2', outerDiameterMm: 60.5, wallThicknessMm: { SGP: 3.8, STPG: 3.8, SUS: 2.8, VP: 4.5 } },
  { nominalA: 65, nominalB: '2-1/2', outerDiameterMm: 76.3, wallThicknessMm: { SGP: 4.2, STPG: 4.2, SUS: 3.0, VP: 6.6 } },
  { nominalA: 80, nominalB: '3', outerDiameterMm: 89.1, wallThicknessMm: { SGP: 4.2, STPG: 4.2, SUS: 3.0, VP: 7.1 } },
  { nominalA: 100, nominalB: '4', outerDiameterMm: 114.3, wallThicknessMm: { SGP: 4.5, STPG: 4.5, SUS: 3.0, VP: 6.6 } },
  { nominalA: 125, nominalB: '5', outerDiameterMm: 139.8, wallThicknessMm: { SGP: 4.9, STPG: 4.9, SUS: 3.4, VP: 7.5 } },
  { nominalA: 150, nominalB: '6', outerDiameterMm: 165.2, wallThicknessMm: { SGP: 5.0, STPG: 5.0, SUS: 3.4, VP: 8.9 } },
  { nominalA: 200, nominalB: '8', outerDiameterMm: 216.3, wallThicknessMm: { SGP: 5.8, STPG: 6.5, SUS: 4.0, VP: 10.3 } },
  { nominalA: 250, nominalB: '10', outerDiameterMm: 267.4, wallThicknessMm: { SGP: 6.6, STPG: 7.8, SUS: 4.0, VP: 12.7 } },
  { nominalA: 300, nominalB: '12', outerDiameterMm: 318.5, wallThicknessMm: { SGP: 6.9, STPG: 8.4, SUS: 4.5, VP: 15.1 } },
];

/**
 * Calculates pipe inner diameter in meters given nominal diameter (A) and pipe material.
 */
export function getPipeInnerDiameterM(nominalA: number, material: PipeMaterial): number {
  const pipe = JIS_PIPE_DIMENSIONS.find((p) => p.nominalA === nominalA);
  if (!pipe) {
    // Default fallback calculation if nominal size not explicitly in table
    return (nominalA * 0.9) / 1000;
  }
  const thickness = pipe.wallThicknessMm[material] ?? pipe.wallThicknessMm.SGP;
  const innerDiameterMm = pipe.outerDiameterMm - 2 * thickness;
  return innerDiameterMm / 1000; // Convert mm to meters
}

/**
 * Fitting & valve standard minor loss coefficient K values
 */
export const FITTING_LOSS_COEFFICIENT_K: Record<FittingType, number> = {
  elbow90: 0.75,
  elbow45: 0.35,
  teeFlowThrough: 0.40,
  teeBranch: 1.50,
  gateValve: 0.17,
  checkValve: 2.00,
  globeValve: 6.00,
};

/**
 * Fitting equivalent length ratio L/D (equivalent length divided by inner diameter)
 */
export const FITTING_EQUIVALENT_LENGTH_LD: Record<FittingType, number> = {
  elbow90: 30,
  elbow45: 16,
  teeFlowThrough: 20,
  teeBranch: 60,
  gateValve: 8,
  checkValve: 100,
  globeValve: 340,
};

/**
 * Calculates equivalent length (in meters) for a given fitting type and inner diameter (m).
 */
export function getFittingEquivalentLengthM(type: FittingType, innerDiameterM: number): number {
  const ratio = FITTING_EQUIVALENT_LENGTH_LD[type] ?? 30;
  return ratio * innerDiameterM;
}
