import { IsoProjectData } from '../types/iso';

export function exportToDXF(data: IsoProjectData): string {
  let dxf = `0\nSECTION\n2\nHEADER\n0\nENDSEC\n0\nSECTION\n2\nTABLES\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n`;

  // Write DXF Lines for Piping Nodes
  const nodeMap = new Map(data.nodes.map((n) => [n.id, n.position]));

  data.pipes.forEach((pipe) => {
    const p1 = nodeMap.get(pipe.startNodeId);
    const p2 = nodeMap.get(pipe.endNodeId);
    if (!p1 || !p2) return;

    dxf += `0\nLINE\n8\nPIPE_${pipe.lineType}\n10\n${p1.x}\n20\n${p1.y}\n30\n${p1.z}\n11\n${p2.x}\n21\n${p2.y}\n31\n${p2.z}\n`;
  });

  dxf += `0\nENDSEC\n0\nEOF\n`;
  return dxf;
}

export interface BOMItem {
  category: string;
  name: string;
  spec: string;
  quantity: number | string;
  unit: string;
}

export function generateBOM(data: IsoProjectData): BOMItem[] {
  const bom: BOMItem[] = [];

  // Pipe lengths
  const nodeMap = new Map(data.nodes.map((n) => [n.id, n.position]));
  let totalLength = 0;

  data.pipes.forEach((pipe) => {
    const p1 = nodeMap.get(pipe.startNodeId);
    const p2 = nodeMap.get(pipe.endNodeId);
    if (!p1 || !p2) return;

    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const dz = p2.z - p1.z;
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
    totalLength += dist;
  });

  bom.push({
    category: '配管 (Pipe)',
    name: 'JIS SGP 配管',
    spec: data.pipes[0]?.nominalDiameter || '50A',
    quantity: (totalLength / 1000).toFixed(2),
    unit: 'm',
  });

  // Components summary
  const compCounts = new Map<string, number>();
  data.components.forEach((c) => {
    compCounts.set(c.symbolType, (compCounts.get(c.symbolType) || 0) + 1);
  });

  compCounts.forEach((count, symbol) => {
    bom.push({
      category: '弁・機器 (Valve / Fitting)',
      name: symbol.replace('_', ' '),
      spec: 'JIS 10K',
      quantity: count,
      unit: '個',
    });
  });

  return bom;
}
