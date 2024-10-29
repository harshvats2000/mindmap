import { Edge, Node } from "@xyflow/react";
import { IMindmap, NodeData } from "./types";
import dagre from "@dagrejs/dagre";

export function darkenHexColor(hex: string, percent: number) {
  // Remove the hash at the start if it's there
  hex = hex.replace(/^#/, "");

  // Parse the r, g, b values
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  // Calculate the darker color
  r = Math.floor(r * (1 - percent / 100));
  g = Math.floor(g * (1 - percent / 100));
  b = Math.floor(b * (1 - percent / 100));

  // Convert back to hex and return
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export function lightenHexColor(hex: string, percent: number) {
  // Remove the hash at the start if it's there
  hex = hex.replace(/^#/, "");

  // Parse the r, g, b values
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  // Calculate the lighter color
  r = Math.min(255, Math.floor(r + (255 - r) * (percent / 100)));
  g = Math.min(255, Math.floor(g + (255 - g) * (percent / 100)));
  b = Math.min(255, Math.floor(b + (255 - b) * (percent / 100)));

  // Convert back to hex and return
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export function formatRelativeTime(timestamp: number): string {
  const now = new Date();
  const date = new Date(timestamp * 1000);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `Now`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} min${diffInMinutes !== 1 ? "s" : ""} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hr${diffInHours !== 1 ? "s" : ""} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths !== 1 ? "s" : ""} ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears !== 1 ? "s" : ""} ago`;
}

export function findSourceEdge(edges: Edge[], nodeId: string): Edge | undefined {
  return edges.find((edge) => edge.target === nodeId);
}

export function findParentNodeId(edges: Edge[], nodeId: string): string | undefined {
  const sourceEdge = findSourceEdge(edges, nodeId);
  return sourceEdge?.source;
}

export function findSiblingNodes(edges: Edge[], nodeId: string): string[] {
  const parentId = findParentNodeId(edges, nodeId);
  if (!parentId) return [];

  // Find all edges that come from the same parent
  return edges.filter((edge) => edge.source === parentId && edge.target !== nodeId).map((edge) => edge.target);
}

export function findPreviousSibling(mindmap: IMindmap, nodeId: string): string | undefined {
  const parentId = findParentNodeId(mindmap.edges, nodeId);
  if (!parentId) return undefined;

  // Get all edges from the parent, sorted by their target positions
  const siblingEdges = mindmap.edges
    .filter((edge) => edge.source === parentId)
    .sort((a, b) => {
      const nodeA = mindmap.nodes.find((n) => n.id === a.target);
      const nodeB = mindmap.nodes.find((n) => n.id === b.target);
      return (nodeA?.position?.y ?? 0) - (nodeB?.position?.y ?? 0);
    });

  // Find the current node's index
  const currentIndex = siblingEdges.findIndex((edge) => edge.target === nodeId);
  if (currentIndex <= 0) return undefined;

  // Return the previous sibling's ID
  return siblingEdges[currentIndex - 1].target;
}

export function findNodesInSameColumn(nodes: Node<NodeData>[], currentNode: Node<NodeData>): Node<NodeData>[] {
  return nodes.filter((n) => n.id !== currentNode.id && n.position.x == currentNode.position.x);
}

export function findPreviousNodeInSameColumn(nodes: Node<NodeData>[], nodeId: string): string | undefined {
  const currentNode = nodes.find((n) => n.id === nodeId);
  if (!currentNode?.position) return undefined;

  const nodesInSameColumn = findNodesInSameColumn(nodes, currentNode);

  // Find the closest node that comes before the current node in y-position
  return nodesInSameColumn
    .filter((n) => n.position.y < currentNode.position.y)
    .sort((a, b) => b.position.y - a.position.y)[0]?.id;
}

export function findNextNodeInSameColumn(nodes: Node<NodeData>[], nodeId: string): string | undefined {
  const currentNode = nodes.find((n) => n.id === nodeId);
  if (!currentNode?.position) return undefined;

  const nodesInSameColumn = findNodesInSameColumn(nodes, currentNode);

  // Find the closest node that comes after the current node in y-position
  return nodesInSameColumn
    .filter((n) => n.position.y > currentNode.position.y)
    .sort((a, b) => a.position.y - b.position.y)[0]?.id;
}

export function findFirstChildNode(mindmap: IMindmap, nodeId: string): string | undefined {
  const targetEdge = mindmap.edges.find((edge) => edge.source === nodeId);
  return targetEdge?.target;
}

const nodeWidth = 150;
const nodeHeight = 1;

export const getLayoutedElements = (nodes: Node<NodeData>[], edges: Edge[], direction = "LR") => {
  const dagreGraph = new dagre.graphlib.Graph({ compound: false }).setDefaultEdgeLabel(() => ({}));
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge: any) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const newNode = {
      ...node,
      targetPosition: isHorizontal ? "left" : "top",
      sourcePosition: isHorizontal ? "right" : "bottom",
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2
      }
    };

    return newNode;
  });

  return { nodes: newNodes, edges };
};
