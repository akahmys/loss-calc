// Pump operating condition inputs and spec calculation parameters

export interface PumpDutyInput {
  flowRateM3H: number;      // Flow rate Q (m3/h) - user input
  staticHeadM: number;      // Static suction + discharge head (m)
  marginRatio: number;      // Safety margin multiplier (e.g. 1.10 for 10% margin)
  pumpEfficiencyRatio: number; // Pump efficiency eta (0.0 to 1.0)
  motorEfficiencyRatio: number; // Motor efficiency eta_m (0.0 to 1.0)
}

export interface PumpCalculationResult {
  flowRateM3S: number;      // Flow rate Q in SI base unit (m3/s)
  flowVelocityMS: number;   // Flow velocity v in pipe (m/s)
  pipeFrictionHeadLossM: number; // Straight pipe loss (m)
  fittingHeadLossM: number; // Fitting & valve minor loss (m)
  totalHeadLossM: number;   // Total loss head hf (m)
  totalRequiredHeadM: number; // Required total head H (m)
  designHeadM: number;      // Total head with safety margin (m)
  waterPowerKw: number;     // Water power P_w (kW)
  shaftPowerKw: number;     // Pump shaft power P_s (kW)
  motorPowerKw: number;     // Required motor power P_m (kW)
}
