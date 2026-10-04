export interface CampusNode {
  id: string;
  name: string;
  buildingCode: string;
}

export interface CampusEdge {
  from: string;
  to: string;
  distanceFeet: number;
  walkSpeedMph: number;
  bikeSpeedMph: number;
  crowdDelayMinutes: number; // additional congestion delay during slot changes
}

export interface TransitRouteResult {
  from: string;
  to: string;
  pathNodes: string[];
  totalDistanceMiles: number;
  walkMinutes: number;
  bikeMinutes: number;
  suggestedBufferMinutes: number;
}

export const VIT_CAMPUS_NODES: Record<string, CampusNode> = {
  sjt: { id: 'sjt', name: 'Silver Jubilee Tower (SJT)', buildingCode: 'SJT 411' },
  tt: { id: 'tt', name: 'Technology Tower (TT)', buildingCode: 'TT 204' },
  mb: { id: 'mb', name: 'Main Building / Dr. MGR Block', buildingCode: 'MB 112' },
  prp: { id: 'prp', name: 'PRP Academic Block', buildingCode: 'PRP 202' },
  cdmm: { id: 'cdmm', name: 'Center for Disaster Mitigation (CDMM)', buildingCode: 'CDMM 102' },
  library: { id: 'library', name: 'Periyar Central Library', buildingCode: 'PCL Floor 2' },
  foodys: { id: 'foodys', name: 'Foodys Central Gazebo', buildingCode: 'Foodys' },
  auditorium: { id: 'auditorium', name: 'Anna Auditorium', buildingCode: 'Auditorium' }
};

// Backward-compatible alias
export const STANFORD_CAMPUS_NODES = VIT_CAMPUS_NODES;

export const VIT_EDGES: CampusEdge[] = [
  { from: 'sjt', to: 'foodys', distanceFeet: 650, walkSpeedMph: 3.2, bikeSpeedMph: 9.5, crowdDelayMinutes: 1 },
  { from: 'foodys', to: 'tt', distanceFeet: 700, walkSpeedMph: 3.2, bikeSpeedMph: 9.5, crowdDelayMinutes: 1 },
  { from: 'tt', to: 'library', distanceFeet: 850, walkSpeedMph: 3.2, bikeSpeedMph: 9.5, crowdDelayMinutes: 1 },
  { from: 'library', to: 'mb', distanceFeet: 900, walkSpeedMph: 3.2, bikeSpeedMph: 9.5, crowdDelayMinutes: 2 },
  { from: 'mb', to: 'cdmm', distanceFeet: 600, walkSpeedMph: 3.2, bikeSpeedMph: 9.5, crowdDelayMinutes: 1 },
  { from: 'sjt', to: 'auditorium', distanceFeet: 1200, walkSpeedMph: 3.2, bikeSpeedMph: 9.5, crowdDelayMinutes: 2 },
  { from: 'auditorium', to: 'prp', distanceFeet: 950, walkSpeedMph: 3.2, bikeSpeedMph: 9.5, crowdDelayMinutes: 1 },
  { from: 'tt', to: 'mb', distanceFeet: 1600, walkSpeedMph: 3.2, bikeSpeedMph: 9.5, crowdDelayMinutes: 2 }
];

export const STANFORD_EDGES = VIT_EDGES;

/**
 * Dijkstra's shortest path algorithm between VIT Vellore campus landmarks.
 */
export function findShortestCampusRoute(fromId: string, toId: string): TransitRouteResult {
  const fromNode = VIT_CAMPUS_NODES[fromId.toLowerCase()] || VIT_CAMPUS_NODES.sjt;
  const toNode = VIT_CAMPUS_NODES[toId.toLowerCase()] || VIT_CAMPUS_NODES.tt;

  if (fromNode.id === toNode.id) {
    return {
      from: fromNode.name,
      to: toNode.name,
      pathNodes: [fromNode.name],
      totalDistanceMiles: 0,
      walkMinutes: 1,
      bikeMinutes: 1,
      suggestedBufferMinutes: 5
    };
  }

  // Build adjacency graph
  const graph: Record<string, Array<{ to: string; distance: number; crowd: number }>> = {};
  for (const nodeKey of Object.keys(VIT_CAMPUS_NODES)) {
    graph[nodeKey] = [];
  }

  for (const edge of VIT_EDGES) {
    graph[edge.from].push({ to: edge.to, distance: edge.distanceFeet, crowd: edge.crowdDelayMinutes });
    graph[edge.to].push({ to: edge.from, distance: edge.distanceFeet, crowd: edge.crowdDelayMinutes });
  }

  // Dijkstra
  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const unvisited = new Set<string>();

  for (const key of Object.keys(VIT_CAMPUS_NODES)) {
    distances[key] = Infinity;
    previous[key] = null;
    unvisited.add(key);
  }

  distances[fromNode.id] = 0;

  while (unvisited.size > 0) {
    let closestNode: string | null = null;
    let minDistance = Infinity;

    for (const node of unvisited) {
      if (distances[node] < minDistance) {
        minDistance = distances[node];
        closestNode = node;
      }
    }

    if (!closestNode || minDistance === Infinity) break;
    if (closestNode === toNode.id) break;

    unvisited.delete(closestNode);

    for (const neighbor of graph[closestNode] || []) {
      if (unvisited.has(neighbor.to)) {
        const alt = distances[closestNode] + neighbor.distance;
        if (alt < distances[neighbor.to]) {
          distances[neighbor.to] = alt;
          previous[neighbor.to] = closestNode;
        }
      }
    }
  }

  // Reconstruct path
  const path: string[] = [];
  let curr: string | null = toNode.id;
  while (curr) {
    path.unshift(VIT_CAMPUS_NODES[curr]?.name || curr);
    curr = previous[curr];
  }

  const totalFeet = distances[toNode.id] === Infinity ? 1200 : distances[toNode.id];
  const miles = Number((totalFeet / 5280).toFixed(2));
  // Walking at 3.2 mph = 5280 * 3.2 / 60 = 281.6 feet/min
  const walkMinutes = Math.max(3, Math.round(totalFeet / 281.6) + 2); // 2 min buffer
  const bikeMinutes = Math.max(2, Math.round(totalFeet / (9.5 * 5280 / 60)) + 1);
  const suggestedBufferMinutes = Math.round(walkMinutes + 5);

  return {
    from: fromNode.name,
    to: toNode.name,
    pathNodes: path.length > 0 ? path : [fromNode.name, toNode.name],
    totalDistanceMiles: miles,
    walkMinutes,
    bikeMinutes,
    suggestedBufferMinutes
  };
}
