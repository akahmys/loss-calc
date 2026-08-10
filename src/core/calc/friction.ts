/**
 * Standard gravitational acceleration (m/s2)
 */
export const GRAVITY_M_S2 = 9.80665;

/**
 * Calculates Reynolds number: Re = (velocity * innerDiameter) / kinematicViscosity
 */
export function calculateReynoldsNumber(
  velocityMS: number,
  innerDiameterM: number,
  kinematicViscosityM2S: number
): number {
  if (kinematicViscosityM2S <= 0 || innerDiameterM <= 0) {
    return 0;
  }
  return (velocityMS * innerDiameterM) / kinematicViscosityM2S;
}

/**
 * Calculates Darcy friction factor 'f' using:
 * - Laminar flow (Re <= 2300): f = 64 / Re
 * - Turbulent flow (Re > 4000): Serghides explicit approximation of Colebrook-White equation
 * - Transition flow (2300 < Re <= 4000): Linear interpolation between laminar and turbulent boundaries
 */
export function calculateDarcyFrictionFactor(
  reynoldsNumber: number,
  innerDiameterM: number,
  roughnessM: number
): number {
  if (reynoldsNumber <= 0 || innerDiameterM <= 0) {
    return 0.02; // Default reasonable friction factor
  }

  // Laminar regime
  if (reynoldsNumber <= 2300) {
    return 64 / reynoldsNumber;
  }

  const relativeRoughness = roughnessM / innerDiameterM;

  // Turbulent regime Serghides explicit Colebrook-White equation solver
  const computeTurbulentFriction = (re: number): number => {
    const A = -2.0 * Math.log10((relativeRoughness / 3.7) + (12.0 / re));
    const B = -2.0 * Math.log10((relativeRoughness / 3.7) + (2.51 * A / re));
    const C = -2.0 * Math.log10((relativeRoughness / 3.7) + (2.51 * B / re));
    
    const term = A - Math.pow(B - A, 2) / (C - 2 * B + A);
    return 1.0 / Math.pow(term, 2);
  };

  if (reynoldsNumber >= 4000) {
    return computeTurbulentFriction(reynoldsNumber);
  }

  // Transition regime (2300 < Re < 4000): Smooth transition blending
  const fLaminar = 64 / 2300;
  const fTurbulent = computeTurbulentFriction(4000);
  const factor = (reynoldsNumber - 2300) / (4000 - 2300);
  
  return fLaminar + factor * (fTurbulent - fLaminar);
}

/**
 * Calculates straight pipe friction head loss using Darcy-Weisbach equation:
 * h_f = f * (L / D) * (v^2 / (2 * g))
 */
export function calculateDarcyWeisbachLoss(
  pipeLengthM: number,
  innerDiameterM: number,
  velocityMS: number,
  frictionFactor: number
): number {
  if (innerDiameterM <= 0) return 0;
  return frictionFactor * (pipeLengthM / innerDiameterM) * (Math.pow(velocityMS, 2) / (2 * GRAVITY_M_S2));
}

/**
 * Calculates straight pipe friction head loss using Hazen-Williams empirical equation:
 * h_f = 10.666 * C^(-1.852) * D^(-4.87) * Q^(1.852) * L
 */
export function calculateHazenWilliamsLoss(
  pipeLengthM: number,
  innerDiameterM: number,
  flowRateM3S: number,
  C: number
): number {
  if (innerDiameterM <= 0 || C <= 0 || flowRateM3S <= 0) return 0;
  return (
    10.666 *
    Math.pow(C, -1.852) *
    Math.pow(innerDiameterM, -4.87) *
    Math.pow(flowRateM3S, 1.852) *
    pipeLengthM
  );
}
