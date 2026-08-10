import { create } from 'zustand';
import {
  FluidProperties,
  PipeLineSystem,
  PipeSegment,
  FittingItem,
  PumpDutyInput,
  PumpCalculationResult,
} from '../core/types';
import {
  DEFAULT_FLUID,
  getWaterProperties,
  PIPE_ROUGHNESS_M,
  HAZEN_WILLIAMS_C,
  getPipeInnerDiameterM,
} from '../core/constants';
import { calculatePumpSpecification, MinorLossMethod } from '../core/calc';

export interface CalculatorState {
  // Input parameters state
  fluid: FluidProperties;
  pipeLine: PipeLineSystem;
  dutyInput: PumpDutyInput;
  minorLossMethod: MinorLossMethod;

  // Calculated results
  calculationResult: PumpCalculationResult;

  // Actions
  setTemperatureCelsius: (tempCelsius: number) => void;
  setPipeSegment: (updates: Partial<PipeSegment>) => void;
  addFitting: (fitting: Omit<FittingItem, 'id'>) => void;
  updateFitting: (id: string, updates: Partial<FittingItem>) => void;
  removeFitting: (id: string) => void;
  setDutyInput: (updates: Partial<PumpDutyInput>) => void;
  setMinorLossMethod: (method: MinorLossMethod) => void;
}

const initialFluid = DEFAULT_FLUID;

const initialPipeLine: PipeLineSystem = {
  id: 'pipeline-default',
  name: 'Default Piping Line',
  pipe: {
    id: 'pipe-default',
    name: 'SGP 50A Pipe',
    material: 'SGP',
    nominalDiameterMm: 50,
    innerDiameterM: getPipeInnerDiameterM(50, 'SGP'),
    lengthM: 30,
    roughnessM: PIPE_ROUGHNESS_M.SGP,
    hazenWilliamsC: HAZEN_WILLIAMS_C.SGP,
  },
  fittings: [
    {
      id: 'fit-1',
      type: 'elbow90',
      name: '90° Elbow (50A)',
      count: 4,
      equivalentLengthM: 1.5,
      lossCoefficientK: 0.75,
    },
    {
      id: 'fit-2',
      type: 'gateValve',
      name: 'Gate Valve (50A)',
      count: 1,
      equivalentLengthM: 0.4,
      lossCoefficientK: 0.17,
    },
  ],
};

const initialDutyInput: PumpDutyInput = {
  flowRateM3H: 15.0,
  staticHeadM: 10.0,
  marginRatio: 1.10,
  pumpEfficiencyRatio: 0.65,
  motorEfficiencyRatio: 0.88,
};

const initialMinorLossMethod: MinorLossMethod = 'K_COEFFICIENT';

const initialCalculationResult = calculatePumpSpecification(
  initialFluid,
  initialPipeLine,
  initialDutyInput,
  initialMinorLossMethod
);

export const useCalculatorStore = create<CalculatorState>((set) => ({
  fluid: initialFluid,
  pipeLine: initialPipeLine,
  dutyInput: initialDutyInput,
  minorLossMethod: initialMinorLossMethod,
  calculationResult: initialCalculationResult,

  setTemperatureCelsius: (tempCelsius: number) => {
    const fluid = getWaterProperties(tempCelsius);
    set((state) => {
      const result = calculatePumpSpecification(
        fluid,
        state.pipeLine,
        state.dutyInput,
        state.minorLossMethod
      );
      return { fluid, calculationResult: result };
    });
  },

  setPipeSegment: (updates: Partial<PipeSegment>) => {
    set((state) => {
      const currentPipe = state.pipeLine.pipe;
      const newMaterial = updates.material ?? currentPipe.material;
      const newNominalMm = updates.nominalDiameterMm ?? currentPipe.nominalDiameterMm;

      // Recalculate inner diameter if nominal size or material changes
      const newInnerDiameterM =
        updates.innerDiameterM ??
        getPipeInnerDiameterM(newNominalMm, newMaterial);

      const updatedPipe: PipeSegment = {
        ...currentPipe,
        ...updates,
        material: newMaterial,
        nominalDiameterMm: newNominalMm,
        innerDiameterM: newInnerDiameterM,
        roughnessM: updates.roughnessM ?? PIPE_ROUGHNESS_M[newMaterial] ?? currentPipe.roughnessM,
        hazenWilliamsC:
          updates.hazenWilliamsC ?? HAZEN_WILLIAMS_C[newMaterial] ?? currentPipe.hazenWilliamsC,
      };

      const updatedPipeLine: PipeLineSystem = {
        ...state.pipeLine,
        pipe: updatedPipe,
      };

      const result = calculatePumpSpecification(
        state.fluid,
        updatedPipeLine,
        state.dutyInput,
        state.minorLossMethod
      );

      return { pipeLine: updatedPipeLine, calculationResult: result };
    });
  },

  addFitting: (fittingData) => {
    set((state) => {
      const newFitting: FittingItem = {
        ...fittingData,
        id: `fit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      };

      const updatedPipeLine: PipeLineSystem = {
        ...state.pipeLine,
        fittings: [...state.pipeLine.fittings, newFitting],
      };

      const result = calculatePumpSpecification(
        state.fluid,
        updatedPipeLine,
        state.dutyInput,
        state.minorLossMethod
      );

      return { pipeLine: updatedPipeLine, calculationResult: result };
    });
  },

  updateFitting: (id: string, updates: Partial<FittingItem>) => {
    set((state) => {
      const updatedFittings = state.pipeLine.fittings.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      );

      const updatedPipeLine: PipeLineSystem = {
        ...state.pipeLine,
        fittings: updatedFittings,
      };

      const result = calculatePumpSpecification(
        state.fluid,
        updatedPipeLine,
        state.dutyInput,
        state.minorLossMethod
      );

      return { pipeLine: updatedPipeLine, calculationResult: result };
    });
  },

  removeFitting: (id: string) => {
    set((state) => {
      const updatedFittings = state.pipeLine.fittings.filter((item) => item.id !== id);

      const updatedPipeLine: PipeLineSystem = {
        ...state.pipeLine,
        fittings: updatedFittings,
      };

      const result = calculatePumpSpecification(
        state.fluid,
        updatedPipeLine,
        state.dutyInput,
        state.minorLossMethod
      );

      return { pipeLine: updatedPipeLine, calculationResult: result };
    });
  },

  setDutyInput: (updates: Partial<PumpDutyInput>) => {
    set((state) => {
      const updatedDutyInput: PumpDutyInput = {
        ...state.dutyInput,
        ...updates,
      };

      const result = calculatePumpSpecification(
        state.fluid,
        state.pipeLine,
        updatedDutyInput,
        state.minorLossMethod
      );

      return { dutyInput: updatedDutyInput, calculationResult: result };
    });
  },

  setMinorLossMethod: (method: MinorLossMethod) => {
    set((state) => {
      const result = calculatePumpSpecification(
        state.fluid,
        state.pipeLine,
        state.dutyInput,
        method
      );

      return { minorLossMethod: method, calculationResult: result };
    });
  },
}));
