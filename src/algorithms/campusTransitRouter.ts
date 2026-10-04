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
  crowdDelayMinutes: number; // additional congestion delay between 11:20 - 11:45
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

export const STANFORD_CAMPUS_NODES: Record<string, CampusNode> = {
  gates: { id: 'gates', name: 'Gates Computer Science', buildingCode: 'Gates B02' },
  packard: { id: 'packard', name: 'Packard Electrical Engineering', buildingCode: 'Packard 101' },
  hewlett: { id: 'hewlett', name: 'Hewlett Teaching Center', buildingCode: 'Hewlett 200' },
  sloan: { id: 'sloan', name: 'Sloan Math Corner', buildingCode: 'Sloan 380' },
  durand: { id: 'durand', name: 'Durand Hall', buildingCode: 'Durand 353' },
  huang: { id: 'huang', name: 'Huang Engineering Center', buildingCode: 'Huang Lib' },
  tressider: { id: 'tressider', name: 'Tressider Memorial Union', buildingCode: 'Tressider' },
  green: { id: 'green', name: 'Green Library', buildingCode: 'Bing Wing' }
};

export const STANFORD_EDGES: CampusEdge[] = [
  { from: 'hewlett', to: 'packard', distanceFeet: 850, walkSpeedMph: 3.2, bikeSpeedMph: 9.5, crowdDelayMinutes: 1 },
  { from: 'packard', to: 'gates', distanceFeet: 1200, walkSpeedMph: 3.2, bikeSpeedMph: 9.5, crowdDelayMinutes: 2 },
  { from: 'gates', to: 'durand', distanceFeet: 1400, walkSpeedMph: 3.2, bikeSpeedMph: 9.5, crowdDelayMinutes: 1 },
  { from: 'hewlett', to: 'sloan', distanceFeet: 1800, walkSpeedMph: 3.2, bikeSpeedMph: 9.5, crowdDelayMinutes: 3 },
  { from: 'sloan', to: 'tressider', distanceFeet: 1600, walkSpeedMph: 3.2, bikeSpeedMph: 9.5, crowdDelayMinutes: 2 },
  { from: 'durand', to: 'huang', distanceFeet: 600, walkSpeedMph: 3.2, bikeSpeedMph: 9.5, crowdDelayMinutes: 1 },
  { from: 'huang', to: 'gates', distanceFeet: 900, walkSpeedMph: 3.2, bikeSpeedMph: 9.5, crowdDelayMinutes: 1 },
  { from: 'sloan', to: 'green', distanceFeet: 1100, walkSpeedMph: 3.2, bikeSpeedMph: 9.5, crowdDelayMinutes: 2 }
];

/**
 * Dijkstra's shortest path algorithm between campus landmarks.
 */
export function findShortestCampusRoute(fromId: string, toId: string): TransitRouteResult {
  const fromNode = STANFORD_CAMPUS_NODES[fromId.toLowerCase()] || STANFORD_CAMPUS_NODES.gates;
  const toNode = STANFORD_CAMPUS_NODES[toId.toLowerCase()] || STANFORD_CAMPUS_NODES.sloan;

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
  for (const nodeKey of Object.keys(STANFORD_CAMPUS_NODES)) {
    graph[nodeKey] = [];
  }

  for (const edge of STANFORD_EDGES) {
    graph[edge.from].push({ to: edge.to, distance: edge.distanceFeet, crowd: edge.crowdDelayMinutes });
    graph[edge.to].push({ to: edge.from, distance: edge.distanceFeet, crowd: edge.crowdDelayMinutes });
  }

  // Dijkstra
  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const unvisited = new Set<string>();

  for (const key of Object.keys(STANFORD_CAMPUS_NODES)) {
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
    path.unshift(STANFORD_CAMPUS_NODES[curr]?.name || curr);
    curr = previous[curr];
  }

  const totalFeet = distances[toNode.id] === Infinity ? 1800 : distances[toNode.id];
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
