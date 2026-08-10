import { FluidProperties } from '../types';

/**
 * Standard water physical properties at atmospheric pressure (1 atm / 0.1 MPa)
 * Source: JSME Data Book for Heat Transfer / Hydraulic Handbook
 */
export const WATER_PROPERTIES_TABLE: FluidProperties[] = [
  { id: 'water-0c', name: 'Water (0°C)', temperatureCelsius: 0, densityKgM3: 999.8, kinematicViscosityM2S: 1.787e-6 },
  { id: 'water-5c', name: 'Water (5°C)', temperatureCelsius: 5, densityKgM3: 1000.0, kinematicViscosityM2S: 1.519e-6 },
  { id: 'water-10c', name: 'Water (10°C)', temperatureCelsius: 10, densityKgM3: 999.7, kinematicViscosityM2S: 1.307e-6 },
  { id: 'water-15c', name: 'Water (15°C)', temperatureCelsius: 15, densityKgM3: 999.1, kinematicViscosityM2S: 1.139e-6 },
  { id: 'water-20c', name: 'Water (20°C)', temperatureCelsius: 20, densityKgM3: 998.2, kinematicViscosityM2S: 1.004e-6 },
  { id: 'water-25c', name: 'Water (25°C)', temperatureCelsius: 25, densityKgM3: 997.0, kinematicViscosityM2S: 0.893e-6 },
  { id: 'water-30c', name: 'Water (30°C)', temperatureCelsius: 30, densityKgM3: 995.7, kinematicViscosityM2S: 0.801e-6 },
  { id: 'water-40c', name: 'Water (40°C)', temperatureCelsius: 40, densityKgM3: 992.2, kinematicViscosityM2S: 0.658e-6 },
  { id: 'water-50c', name: 'Water (50°C)', temperatureCelsius: 50, densityKgM3: 988.0, kinematicViscosityM2S: 0.553e-6 },
  { id: 'water-60c', name: 'Water (60°C)', temperatureCelsius: 60, densityKgM3: 983.2, kinematicViscosityM2S: 0.474e-6 },
  { id: 'water-70c', name: 'Water (70°C)', temperatureCelsius: 70, densityKgM3: 977.8, kinematicViscosityM2S: 0.413e-6 },
  { id: 'water-80c', name: 'Water (80°C)', temperatureCelsius: 80, densityKgM3: 971.8, kinematicViscosityM2S: 0.365e-6 },
  { id: 'water-90c', name: 'Water (90°C)', temperatureCelsius: 90, densityKgM3: 965.3, kinematicViscosityM2S: 0.326e-6 },
  { id: 'water-100c', name: 'Water (100°C)', temperatureCelsius: 100, densityKgM3: 958.4, kinematicViscosityM2S: 0.294e-6 },
];

export const DEFAULT_FLUID: FluidProperties = WATER_PROPERTIES_TABLE[4]; // Water at 20°C

/**
 * Linearly interpolates water properties for a given temperature in °C (bounded between 0°C and 100°C).
 */
export function getWaterProperties(tempCelsius: number): FluidProperties {
  const temp = Math.max(0, Math.min(100, tempCelsius));
  
  // Find surrounding table entries
  for (let i = 0; i < WATER_PROPERTIES_TABLE.length - 1; i++) {
    const lower = WATER_PROPERTIES_TABLE[i];
    const upper = WATER_PROPERTIES_TABLE[i + 1];
    
    if (temp >= lower.temperatureCelsius && temp <= upper.temperatureCelsius) {
      const factor = (temp - lower.temperatureCelsius) / (upper.temperatureCelsius - lower.temperatureCelsius);
      const density = lower.densityKgM3 + factor * (upper.densityKgM3 - lower.densityKgM3);
      const viscosity = lower.kinematicViscosityM2S + factor * (upper.kinematicViscosityM2S - lower.kinematicViscosityM2S);
      
      return {
        id: `water-custom-${temp.toFixed(1)}c`,
        name: `Water (${temp.toFixed(1)}°C)`,
        temperatureCelsius: temp,
        densityKgM3: density,
        kinematicViscosityM2S: viscosity,
      };
    }
  }
  
  return DEFAULT_FLUID;
}
