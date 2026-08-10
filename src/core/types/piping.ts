// Piping component types and system definitions

export type PipeMaterial = 'SGP' | 'STPG' | 'SUS' | 'VP';

export interface PipeSegment {
  id: string;
  name: string;
  material: PipeMaterial;
  nominalDiameterMm: number; // e.g. 50 (for 50A)
  innerDiameterM: number;    // SI base unit (m)
  lengthM: number;           // SI base unit (m)
  roughnessM: number;        // Pipe absolute roughness epsilon (m)
  hazenWilliamsC: number;    // Hazen-Williams friction coefficient C
}

export type FittingType =
  | 'threadedSocketJoint' // ねじ込み・差込み継手
  | 'buttWeldedJoint'     // 突合せ溶接継手
  | 'flangedJoint'        // フランジ継手
  | 'unionJoint'          // ユニオン継手
  | 'spigotSocketJoint';  // インロー継手

export interface FittingItem {
  id: string;
  type: FittingType;
  name: string;
  count: number;
  equivalentLengthM: number; // Equivalent length per item (m)
  lossCoefficientK: number;  // Local loss coefficient K
}

export interface PipeLineSystem {
  id: string;
  name: string;
  pipe: PipeSegment;
  fittings: FittingItem[];
}
