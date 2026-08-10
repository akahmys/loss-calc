import { describe, it, expect, beforeEach } from 'vitest';
import { useCalculatorStore } from '../useCalculatorStore';

describe('useCalculatorStore Zustand Store', () => {
  beforeEach(() => {
    // Reset to default initial state before each test
    useCalculatorStore.setState(useCalculatorStore.getInitialState?.() || {});
  });

  it('initializes with valid default fluid, piping, and calculation results', () => {
    const state = useCalculatorStore.getState();
    expect(state.fluid.temperatureCelsius).toBe(20);
    expect(state.pipeLine.pipe.nominalDiameterMm).toBe(50);
    expect(state.dutyInput.flowRateM3H).toBe(15.0);
    expect(state.calculationResult.totalRequiredHeadM).toBeGreaterThan(10.0);
  });

  it('updates fluid temperature and recalculates calculationResult reactively', () => {
    const initialResult = useCalculatorStore.getState().calculationResult;

    // Change water temperature to 80°C (lower viscosity & density)
    useCalculatorStore.getState().setTemperatureCelsius(80);

    const updatedState = useCalculatorStore.getState();
    expect(updatedState.fluid.temperatureCelsius).toBe(80);
    expect(updatedState.fluid.densityKgM3).toBeCloseTo(971.8, 1);
    expect(updatedState.calculationResult.pipeFrictionHeadLossM).not.toBe(
      initialResult.pipeFrictionHeadLossM
    );
  });

  it('updates pipe segment specs and recalculates inner diameter automatically', () => {
    // Change pipe nominal size to 80A SUS
    useCalculatorStore.getState().setPipeSegment({ nominalDiameterMm: 80, material: 'SUS' });

    const updatedState = useCalculatorStore.getState();
    expect(updatedState.pipeLine.pipe.nominalDiameterMm).toBe(80);
    expect(updatedState.pipeLine.pipe.material).toBe('SUS');
    // Outer 89.1mm - 2*3.0mm = 83.1mm -> 0.0831m
    expect(updatedState.pipeLine.pipe.innerDiameterM).toBeCloseTo(0.0831, 4);
  });

  it('adds, updates, and removes fitting items reactively updating calculation results', () => {
    const store = useCalculatorStore.getState();
    const initialFittingCount = store.pipeLine.fittings.length;
    const initialFittingLoss = store.calculationResult.fittingHeadLossM;

    // 1. Add fitting
    store.addFitting({
      type: 'checkValve',
      name: 'Check Valve (50A)',
      count: 1,
      equivalentLengthM: 5.0,
      lossCoefficientK: 2.0,
    });

    let state = useCalculatorStore.getState();
    expect(state.pipeLine.fittings.length).toBe(initialFittingCount + 1);
    expect(state.calculationResult.fittingHeadLossM).toBeGreaterThan(initialFittingLoss);

    // 2. Remove added fitting
    const addedId = state.pipeLine.fittings[state.pipeLine.fittings.length - 1].id;
    store.removeFitting(addedId);

    state = useCalculatorStore.getState();
    expect(state.pipeLine.fittings.length).toBe(initialFittingCount);
    expect(state.calculationResult.fittingHeadLossM).toBeCloseTo(initialFittingLoss, 5);
  });

  it('updates duty parameters and recalculates powers and design head', () => {
    const store = useCalculatorStore.getState();
    const initialDesignHead = store.calculationResult.designHeadM;

    // Increase static head to 30m
    store.setDutyInput({ staticHeadM: 30.0 });

    const updatedState = useCalculatorStore.getState();
    expect(updatedState.dutyInput.staticHeadM).toBe(30.0);
    expect(updatedState.calculationResult.totalRequiredHeadM).toBeGreaterThan(30.0);
    expect(updatedState.calculationResult.designHeadM).toBeGreaterThan(initialDesignHead);
  });
});
