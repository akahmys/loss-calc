// Isometric Drawing & 3D Piping Schema Types (JIS B 0011-2 compliant)

export type IsoViewType = 'IS1_SW' | 'IS2_SE' | 'IS3_NE' | 'IS4_NW';

export interface IsoPoint3D {
  x: number;
  y: number;
  z: number;
}

export interface IsoPoint2D {
  x: number;
  y: number;
}

export interface IsoNode {
  id: string;
  position: IsoPoint3D;
  label?: string;
}

export type IsoLineType = 'PRIMARY' | 'AUXILIARY' | 'HIDDEN';

export interface IsoPipe {
  id: string;
  startNodeId: string;
  endNodeId: string;
  nominalDiameter: string; // e.g. "50A"
  fluidCode: string;       // e.g. "CW", "HW"
  lineType: IsoLineType;
}

export type SymbolType =
  | 'VALVE_GATE'
  | 'VALVE_CHECK'
  | 'VALVE_GLOBE'
  | 'FLANGE'
  | 'PUMP'
  | 'TANK';

export type OrientationPlane = 'XY' | 'YZ' | 'XZ';

export interface IsoComponent {
  id: string;
  nodeId: string;
  symbolType: SymbolType;
  orientationPlane: OrientationPlane;
  label?: string;
}

export interface ViewSettings {
  activeView: IsoViewType;
  rotationAngleDeg: number; // View orientation angle theta in degrees
  scale: number;
  originX: number;
  originY: number;
}

export interface IsoProjectData {
  projectInfo: {
    title: string;
    drawingNumber: string;
    designer?: string;
    date?: string;
  };
  viewSettings: ViewSettings;
  nodes: IsoNode[];
  pipes: IsoPipe[];
  components: IsoComponent[];
}
