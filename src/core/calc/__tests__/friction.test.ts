import { describe, it, expect } from 'vitest';
import {
  calculateReynoldsNumber,
  calculateDarcyFrictionFactor,
  calculateDarcyWeisbachLoss,
  calculateHazenWilliamsLoss,
  GRAVITY_M_S2,
} from '../friction';

describe('Straight Pipe Friction Engine', () => {
  describe('calculateReynoldsNumber', () => {
    it('calculates Reynolds number accurately for water flow', () => {
      // Water at 20°C: kinematic viscosity = 1.004e-6 m2/s
      // v = 2.0 m/s, D = 0.05m (50A)
      const re = calculateReynoldsNumber(2.0, 0.05, 1.004e-6);
      expect(re).toBeCloseTo(99601.59, 1);
    });

    it('returns 0 for invalid inputs', () => {
      expect(calculateReynoldsNumber(2.0, 0, 1.004e-6)).toBe(0);
      expect(calculateReynoldsNumber(2.0, 0.05, 0)).toBe(0);
    });
  });

  describe('calculateDarcyFrictionFactor', () => {
    it('returns exact 64 / Re for laminar flow (Re <= 2300)', () => {
      const f = calculateDarcyFrictionFactor(1000, 0.05, 0.000045);
      expect(f).toBe(0.064);
    });

    it('calculates turbulent friction factor accurately via Serghides formula', () => {
      // Re = 100,000, e/D = 0.000045 / 0.05 = 0.0009
      // Expected Colebrook-White friction factor ~0.0207
      const f = calculateDarcyFrictionFactor(100000, 0.05, 0.000045);
      expect(f).toBeGreaterThan(0.020);
      expect(f).toBeLessThan(0.022);
    });

    it('interpolates linearly in transition region (2300 < Re < 4000)', () => {
      const fLaminarBoundary = calculateDarcyFrictionFactor(2300, 0.05, 0.000045); // ~0.0278
      const fMidTransition = calculateDarcyFrictionFactor(3150, 0.05, 0.000045);
      const fTurbulentBoundary = calculateDarcyFrictionFactor(4000, 0.05, 0.000045); // ~0.0408

      expect(fMidTransition).toBeGreaterThan(fLaminarBoundary);
      expect(fMidTransition).toBeLessThan(fTurbulentBoundary);
    });
  });

  describe('calculateDarcyWeisbachLoss', () => {
    it('calculates head loss in meters correctly', () => {
      // L = 100m, D = 0.05m, v = 2m/s, f = 0.02
      // h_f = 0.02 * (100 / 0.05) * (4 / (2 * 9.80665)) = 40 * (4 / 19.6133) = 8.1577m
      const hf = calculateDarcyWeisbachLoss(100, 0.05, 2.0, 0.02);
      const expected = 0.02 * (100 / 0.05) * (4 / (2 * GRAVITY_M_S2));
      expect(hf).toBeCloseTo(expected, 4);
    });
  });

  describe('calculateHazenWilliamsLoss', () => {
    it('calculates Hazen-Williams head loss correctly', () => {
      // L = 100m, D = 0.05m, Q = 0.003927 m3/s (v ~ 2m/s), C = 100
      const Q = 0.003927;
      const hf = calculateHazenWilliamsLoss(100, 0.05, Q, 100);
      expect(hf).toBeGreaterThan(0);
      expect(Number.isFinite(hf)).toBe(true);
    });
  });
});
