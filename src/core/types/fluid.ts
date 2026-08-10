// Fluid physical properties required for friction and head loss calculations
export interface FluidProperties {
  id: string;
  name: string;
  temperatureCelsius: number;
  densityKgM3: number;        // Density (kg/m3) - SI base unit
  kinematicViscosityM2S: number; // Kinematic viscosity (m2/s) - SI base unit
}
