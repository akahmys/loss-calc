import { describe, it, expect } from 'vitest';
import {
  FluidProperties,
  PipeLineSystem,
  PumpDutyInput,
} from '../../types';
import {
  calculateFlowVelocity,
  calculateWaterPowerKw,
  calculateShaftPowerKw,
  calculateMotorPowerKw,
  calculatePumpSpecification,
} from '../pump';

describe('Pump Specification & Total Head Engine', () => {
  const sampleFluid: FluidProperties = {
    id: 'water-20c',
    name: 'Water (20°C)',
    temperatureCelsius: 20,
    densityKgM3: 998.2,
    kinematicViscosityM2S: 1.004e-6,
  };

  const samplePipeLine: PipeLineSystem = {
    id: 'sys-1',
    name: 'Test Piping System',
    pipe: {
      id: 'pipe-1',
      name: 'SGP 50A Pipe',
      material: 'SGP',
      nominalDiameterMm: 50,
      innerDiameterM: 0.0529, // 60.5 - 2*3.8 = 52.9mm
      lengthM: 50,
      roughnessM: 0.000045,
      hazenWilliamsC: 100,
    },
    fittings: [
      {
        id: 'f-1',
        type: 'threadedSocketJoint',
        name: 'ねじ込み・差込み継手',
        count: 4,
        equivalentLengthM: 1.5,
        lossCoefficientK: 0.75,
      },
    ],
  };

  const sampleDuty: PumpDutyInput = {
    flowRateM3H: 12.0, // 12 m3/h = 0.003333 m3/s
    staticHeadM: 15.0,
    marginRatio: 1.10, // 10% safety margin
    pumpEfficiencyRatio: 0.70, // 70%
    motorEfficiencyRatio: 0.90, // 90%
  };

  describe('calculateFlowVelocity', () => {
    it('calculates mean flow velocity accurately', () => {
      // Q = 0.0033333 m3/s, D = 0.0529m
      // Area = pi * (0.0529)^2 / 4 = 0.0021979 m2
      // v = 0.0033333 / 0.0021979 = 1.5166 m/s
      const v = calculateFlowVelocity(12 / 3600, 0.0529);
      expect(v).toBeCloseTo(1.5166, 3);
    });
  });

  describe('Power Calculations', () => {
    it('calculates water power, shaft power, and motor power', () => {
      // Q = 0.0033333 m3/s, rho = 1000 kg/m3, H = 20m
      // P_w = (1000 * 9.80665 * 0.0033333 * 20) / 1000 = 0.6537 kW
      const pw = calculateWaterPowerKw(12 / 3600, 1000, 20);
      expect(pw).toBeCloseTo(0.65377, 3);

      // eta_p = 0.70 -> P_s = 0.65377 / 0.70 = 0.9339 kW
      const ps = calculateShaftPowerKw(pw, 0.70);
      expect(ps).toBeCloseTo(0.93396, 3);

      // eta_m = 0.90 -> P_m = 0.93396 / 0.90 = 1.0377 kW
      const pm = calculateMotorPowerKw(ps, 0.90);
      expect(pm).toBeCloseTo(1.0377, 3);
    });
  });

  describe('calculatePumpSpecification Master Engine', () => {
    it('returns complete, non-zero PumpCalculationResult with correct values', () => {
      const result = calculatePumpSpecification(sampleFluid, samplePipeLine, sampleDuty);

      expect(result.flowRateM3S).toBeCloseTo(12 / 3600, 5);
      expect(result.flowVelocityMS).toBeGreaterThan(1.0);
      expect(result.pipeFrictionHeadLossM).toBeGreaterThan(0);
      expect(result.fittingHeadLossM).toBeGreaterThan(0);
      expect(result.totalHeadLossM).toBe(result.pipeFrictionHeadLossM + result.fittingHeadLossM);
      expect(result.totalRequiredHeadM).toBe(15.0 + result.totalHeadLossM);
      expect(result.designHeadM).toBeCloseTo(result.totalRequiredHeadM * 1.10, 4);
      expect(result.waterPowerKw).toBeGreaterThan(0);
      expect(result.shaftPowerKw).toBeGreaterThan(result.waterPowerKw);
      expect(result.motorPowerKw).toBeGreaterThan(result.shaftPowerKw);
    });
  });
});
