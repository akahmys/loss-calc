import { describe, it, expect } from 'vitest';
import { FittingItem } from '../../types';
import {
  calculateFittingLossK,
  calculateFittingLossEquivalentLength,
  calculateTotalFittingLoss,
} from '../minor';
import { GRAVITY_M_S2 } from '../friction';

describe('Fitting & Valve Minor Loss Engine', () => {
  const sampleElbow: FittingItem = {
    id: 'f-1',
    type: 'elbow90',
    name: '90° Elbow (50A)',
    count: 4,
    equivalentLengthM: 1.5, // 30 * 0.05m
    lossCoefficientK: 0.75,
  };

  const sampleValve: FittingItem = {
    id: 'f-2',
    type: 'gateValve',
    name: 'Gate Valve (50A)',
    count: 1,
    equivalentLengthM: 0.4, // 8 * 0.05m
    lossCoefficientK: 0.17,
  };

  describe('calculateFittingLossK', () => {
    it('calculates head loss based on K coefficient correctly', () => {
      // v = 2.0 m/s, count = 4, K = 0.75
      // h = 4 * 0.75 * (4 / (2 * 9.80665)) = 3.0 * (4 / 19.6133) = 0.6118 m
      const hf = calculateFittingLossK(sampleElbow, 2.0);
      const expected = 4 * 0.75 * (4.0 / (2 * GRAVITY_M_S2));
      expect(hf).toBeCloseTo(expected, 4);
    });

    it('returns 0 for count <= 0 or velocity <= 0', () => {
      expect(calculateFittingLossK({ ...sampleElbow, count: 0 }, 2.0)).toBe(0);
      expect(calculateFittingLossK(sampleElbow, 0)).toBe(0);
    });
  });

  describe('calculateFittingLossEquivalentLength', () => {
    it('calculates head loss based on equivalent length correctly', () => {
      // D = 0.05m, f = 0.02, v = 2.0m/s, Le = 1.5m, count = 4
      // h = 4 * 0.02 * (1.5 / 0.05) * (4 / (2 * 9.80665)) = 0.08 * 30 * (4 / 19.6133) = 2.4 * 0.20394 = 0.4894 m
      const hf = calculateFittingLossEquivalentLength(sampleElbow, 0.05, 0.02, 2.0);
      const expected = 4 * 0.02 * (1.5 / 0.05) * (4.0 / (2 * GRAVITY_M_S2));
      expect(hf).toBeCloseTo(expected, 4);
    });
  });

  describe('calculateTotalFittingLoss', () => {
    it('aggregates head loss for multiple fittings using K method', () => {
      const fittings = [sampleElbow, sampleValve];
      const totalKLoss = calculateTotalFittingLoss(fittings, 0.05, 2.0, 0.02, 'K_COEFFICIENT');

      const expectedElbow = calculateFittingLossK(sampleElbow, 2.0);
      const expectedValve = calculateFittingLossK(sampleValve, 2.0);

      expect(totalKLoss).toBeCloseTo(expectedElbow + expectedValve, 4);
    });

    it('aggregates head loss for multiple fittings using Equivalent Length method', () => {
      const fittings = [sampleElbow, sampleValve];
      const totalLeLoss = calculateTotalFittingLoss(fittings, 0.05, 2.0, 0.02, 'EQUIVALENT_LENGTH');

      const expectedElbow = calculateFittingLossEquivalentLength(sampleElbow, 0.05, 0.02, 2.0);
      const expectedValve = calculateFittingLossEquivalentLength(sampleValve, 0.05, 0.02, 2.0);

      expect(totalLeLoss).toBeCloseTo(expectedElbow + expectedValve, 4);
    });
  });
});
