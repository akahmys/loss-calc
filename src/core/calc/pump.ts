import {
  FluidProperties,
  PipeLineSystem,
  PumpDutyInput,
  PumpCalculationResult,
} from '../types';
import {
  calculateReynoldsNumber,
  calculateDarcyFrictionFactor,
  calculateDarcyWeisbachLoss,
  GRAVITY_M_S2,
} from './friction';
import { calculateTotalFittingLoss, MinorLossMethod } from './minor';

/**
 * Calculates mean flow velocity inside pipe (m/s): v = (4 * Q) / (pi * D^2)
 */
export function calculateFlowVelocity(flowRateM3S: number, innerDiameterM: number): number {
  if (innerDiameterM <= 0 || flowRateM3S <= 0) return 0;
  const areaM2 = (Math.PI * Math.pow(innerDiameterM, 2)) / 4;
  return flowRateM3S / areaM2;
}

/**
 * Calculates hydraulic water power P_w (kW):
 * P_w = (rho * g * Q * H) / 1000
 */
export function calculateWaterPowerKw(
  flowRateM3S: number,
  densityKgM3: number,
  totalHeadM: number
): number {
  if (flowRateM3S <= 0 || densityKgM3 <= 0 || totalHeadM <= 0) return 0;
  return (densityKgM3 * GRAVITY_M_S2 * flowRateM3S * totalHeadM) / 1000;
}

/**
 * Calculates pump shaft power P_s (kW):
 * P_s = P_w / eta_pump
 */
export function calculateShaftPowerKw(waterPowerKw: number, pumpEfficiencyRatio: number): number {
  if (pumpEfficiencyRatio <= 0) return 0;
  return waterPowerKw / pumpEfficiencyRatio;
}

/**
 * Calculates required motor power P_m (kW):
 * P_m = P_s / eta_motor
 */
export function calculateMotorPowerKw(shaftPowerKw: number, motorEfficiencyRatio: number): number {
  if (motorEfficiencyRatio <= 0) return 0;
  return shaftPowerKw / motorEfficiencyRatio;
}

/**
 * Master calculation engine performing complete pump specification calculation
 */
export function calculatePumpSpecification(
  fluid: FluidProperties,
  pipeLine: PipeLineSystem,
  dutyInput: PumpDutyInput,
  minorLossMethod: MinorLossMethod = 'K_COEFFICIENT'
): PumpCalculationResult {
  // Convert flow rate m3/h -> m3/s
  const flowRateM3S = dutyInput.flowRateM3H / 3600;
  const innerDiameterM = pipeLine.pipe.innerDiameterM;

  // 1. Flow velocity
  const flowVelocityMS = calculateFlowVelocity(flowRateM3S, innerDiameterM);

  // 2. Reynolds number & friction factor
  const reynoldsNumber = calculateReynoldsNumber(
    flowVelocityMS,
    innerDiameterM,
    fluid.kinematicViscosityM2S
  );
  const frictionFactor = calculateDarcyFrictionFactor(
    reynoldsNumber,
    innerDiameterM,
    pipeLine.pipe.roughnessM
  );

  // 3. Straight pipe friction loss
  const pipeFrictionHeadLossM = calculateDarcyWeisbachLoss(
    pipeLine.pipe.lengthM,
    innerDiameterM,
    flowVelocityMS,
    frictionFactor
  );

  // 4. Fitting minor loss
  const fittingHeadLossM = calculateTotalFittingLoss(
    pipeLine.fittings,
    innerDiameterM,
    flowVelocityMS,
    frictionFactor,
    minorLossMethod
  );

  // 5. Total losses & heads
  const totalHeadLossM = pipeFrictionHeadLossM + fittingHeadLossM;
  const totalRequiredHeadM = dutyInput.staticHeadM + totalHeadLossM;
  const designHeadM = totalRequiredHeadM * (dutyInput.marginRatio || 1.0);

  // 6. Power calculations
  const waterPowerKw = calculateWaterPowerKw(flowRateM3S, fluid.densityKgM3, designHeadM);
  const shaftPowerKw = calculateShaftPowerKw(waterPowerKw, dutyInput.pumpEfficiencyRatio);
  const motorPowerKw = calculateMotorPowerKw(shaftPowerKw, dutyInput.motorEfficiencyRatio);

  return {
    flowRateM3S,
    flowVelocityMS,
    pipeFrictionHeadLossM,
    fittingHeadLossM,
    totalHeadLossM,
    totalRequiredHeadM,
    designHeadM,
    waterPowerKw,
    shaftPowerKw,
    motorPowerKw,
  };
}
