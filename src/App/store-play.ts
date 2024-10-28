import {
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  OnNodesChange,
  OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges
} from "@xyflow/react";
import { create } from "zustand";
import { IMindmap, NodeData } from "./types";
import dagre from "@dagrejs/dagre";
import { Timestamp } from "firebase/firestore";
import { nanoid } from "nanoid";
import {
  findFirstChildNode,
  findNextNodeInSameColumn,
  findParentNodeId,
  findPreviousNodeInSameColumn,
  findPreviousSibling
} from "./helpers";

const nodeWidth = 150;
const nodeHeight = 1;

const getLayoutedElements = (nodes: Node<NodeData>[], edges: Edge[], direction = "LR") => {
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

export type RFStatePlay = {
  selectedNode: Node | null;
  setSelectedNode: (nodeId: string | null) => void;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  updateNodeLabel: (nodeId: string, label: string) => void;
  updateSelectedNode: (nodeId: string | null) => void;
  addChildNode: () => void;
  bgColor: string;
  updateBgColor: (color: string) => void;
  deleteNodeAndChildren: () => void;
  isActionButtonVisible: boolean;
  toggleActionButton: () => void;
  createMindmap: () => Promise<string>;
  mindmap: IMindmap | null;
  addSiblingNode: () => void;
  selectPreviousSibling: () => void;
  selectPreviousNodeInSameColumn: () => void;
  selectNextNodeInSameColumn: () => void;
  selectParentNode: () => void;
  selectFirstChildNode: () => void;
};

const useStore = create<RFStatePlay>((set, get) => ({
  selectedNode: null,
  setSelectedNode: (nodeId: string | null) => {
    set({ selectedNode: get().mindmap?.nodes.find((node) => node.id === nodeId) || null });
  },
  bgColor: "#004B4B",
  isActionButtonVisible: true,
  toggleActionButton: () => {
    set({ isActionButtonVisible: !get().isActionButtonVisible });
  },
  updateBgColor: (color: string) => {
    set({ bgColor: color });
  },
  onNodesChange: (changes: NodeChange[]) => {
    const mindmap = get().mindmap!;

    set({
      mindmap: {
        ...mindmap,
        nodes: getLayoutedElements(applyNodeChanges(changes, mindmap.nodes) as Node<NodeData>[], mindmap.edges)
          .nodes as Node<NodeData>[]
      }
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    const mindmap = get().mindmap!;

    set({
      mindmap: {
        ...mindmap,
        edges: getLayoutedElements(mindmap.nodes, applyEdgeChanges(changes, mindmap.edges)).edges as Edge[]
      }
    });
  },
  updateNodeLabel: (nodeId: string, label: string) => {
    const mindmap = get().mindmap!;
    set({
      mindmap: {
        ...mindmap,
        nodes: mindmap.nodes.map((node) => {
          if (node.id === nodeId) {
            // Update the label in the existing node's data
            node.data.label = label;
          }
          return node;
        })
      }
    });
  },
  updateSelectedNode: (nodeId: string | null) => {
    set({
      selectedNode: get().mindmap?.nodes.find((node) => node.id === nodeId) || null
    });
  },
  addChildNode: () => {
    const id = get().selectedNode?.id;
    if (!id) return;
    console.log("id", id);
    const mindmap = get().mindmap!;
    const node = mindmap.nodes.find((node) => node.id === id);
    const newNodeId = `node-${mindmap.nodes.length + 1}`;
    const newNodeLabel = `Node ${mindmap.nodes.length + 1}`;
    const newNode: Node = {
      id: newNodeId,
      data: { label: newNodeLabel },
      position: { x: 0, y: 0 },
      type: "textUpdater"
    };

    const newEdge = {
      id: `edge-${mindmap.edges.length + 1}`,
      source: node?.id,
      target: newNode.id,
      type: "smoothstep",
      animated: true
      // style: {
      //   strokeWidth: 2,
      //   stroke: "#FF0072"
      // }
    };

    const updatedNodes = [...mindmap.nodes, newNode];
    const updatedEdges = [...mindmap.edges, newEdge];

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      updatedNodes as Node<NodeData>[],
      updatedEdges as Edge[]
    );

    set({
      mindmap: {
        ...mindmap,
        nodes: layoutedNodes as Node<NodeData>[],
        edges: layoutedEdges as Edge[]
      }
    });

    // Might have race condition here, this is to ensure that the new node is selected after the layout is updated
    setTimeout(() => {
      get().updateSelectedNode(newNode.id);
    }, 10);
  },
  deleteNodeAndChildren: () => {
    const nodeId = get().selectedNode?.id;
    if (!nodeId || nodeId === "root") return;
    const nodesToDelete = new Set<string>();
    const edgesToDelete = new Set<string>();
    const mindmap = get().mindmap!;

    const traverseAndMarkForDeletion = (currentNodeId: string) => {
      nodesToDelete.add(currentNodeId);
      mindmap.edges.forEach((edge) => {
        if (edge.source === currentNodeId) {
          edgesToDelete.add(edge.id);
          traverseAndMarkForDeletion(edge.target);
        }
      });
    };

    traverseAndMarkForDeletion(nodeId);

    const updatedNodes = mindmap.nodes.filter((node) => !nodesToDelete.has(node.id));

    // Recreate edges based on the remaining nodes
    const updatedEdges = mindmap.edges
      .filter(
        (edge) => !edgesToDelete.has(edge.id) && !nodesToDelete.has(edge.source) && !nodesToDelete.has(edge.target)
      )
      .map((edge) => ({
        ...edge,
        id: `edge-${Math.random().toString(36).substr(2, 9)}` // Generate new unique ID
      }));

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      updatedNodes as Node<NodeData>[],
      updatedEdges as Edge[]
    );

    set({
      mindmap: {
        ...mindmap,
        nodes: layoutedNodes as Node<NodeData>[],
        edges: layoutedEdges as Edge[]
      }
    });

    setTimeout(() => {
      get().updateSelectedNode(null);
    }, 10);
  },
  mindmap: null,
  createMindmap: async () => {
    const initialNodes: Node<NodeData>[] = [
      {
        id: "root",
        type: "textUpdater",
        data: { label: "New Mindmap" },
        position: { x: 0, y: 0 }
      },
      {
        id: "node-1",
        type: "textUpdater",
        data: { label: "Topic 1" },
        position: { x: 0, y: 0 }
      },
      {
        id: "node-2",
        type: "textUpdater",
        data: { label: "Topic 2" },
        position: { x: 0, y: 0 }
      },
      {
        id: "node-3",
        type: "textUpdater",
        data: { label: "Topic 3" },
        position: { x: 0, y: 0 }
      }
    ];

    const initialEdges: Edge[] = [
      {
        id: "edge-1",
        source: "root",
        target: "node-1",
        type: "smoothstep",
        animated: true
      },
      {
        id: "edge-2",
        source: "root",
        target: "node-2",
        type: "smoothstep",
        animated: true
      },
      {
        id: "edge-3",
        source: "root",
        target: "node-3",
        type: "smoothstep",
        animated: true
      }
    ];

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(initialNodes, initialEdges);

    const newMindmap: IMindmap = {
      id: nanoid(),
      title: "Untitled Mindmap",
      nodes: layoutedNodes as Node<NodeData>[],
      edges: layoutedEdges as Edge[],
      userId: "does not matter",
      createdAt: Timestamp.fromDate(new Date()),
      updatedAt: Timestamp.fromDate(new Date())
    };

    try {
      set({
        mindmap: { ...newMindmap, id: newMindmap.id }
      });

      return newMindmap.id;
    } catch (error) {
      console.error("Error creating mindmap: ", error);
      throw error;
    }
  },
  addSiblingNode: () => {
    const id = get().selectedNode?.id!;
    const mindmap = get().mindmap!;

    const newNodeId = `node-${mindmap.nodes.length + 1}`;
    const newNodeLabel = `Node ${mindmap.nodes.length + 1}`;
    const newNode: Node = {
      id: newNodeId,
      data: { label: newNodeLabel },
      position: { x: 0, y: 0 },
      type: "textUpdater"
    };

    const newEdge: Edge = {
      id: `edge-${mindmap.edges.length + 1}`,
      source: findParentNodeId(mindmap.edges, id)!,
      target: newNode.id,
      type: "smoothstep",
      animated: true
    };

    const edgeIndex = mindmap.edges.findIndex((edge) => edge.target === id);
    const nodeIndex = mindmap.nodes.findIndex((node) => node.id === id);
    const updatedNodes = [...mindmap.nodes.slice(0, nodeIndex + 1), newNode, ...mindmap.nodes.slice(nodeIndex + 1)];
    const updatedEdges = [...mindmap.edges.slice(0, edgeIndex + 1), newEdge, ...mindmap.edges.slice(edgeIndex + 1)];

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      updatedNodes as Node<NodeData>[],
      updatedEdges
    );

    set({
      mindmap: {
        ...mindmap,
        nodes: layoutedNodes as Node<NodeData>[],
        edges: layoutedEdges
      }
    });

    // Select the new node after creation
    setTimeout(() => {
      get().updateSelectedNode(newNode.id);
    }, 10);
  },
  selectPreviousSibling: () => {
    const id = get().selectedNode?.id!;
    const previousSibling = findPreviousSibling(get().mindmap!, id);
    if (previousSibling) {
      get().updateSelectedNode(previousSibling);
    }
  },
  selectPreviousNodeInSameColumn: () => {
    const id = get().selectedNode?.id!;
    const previousNode = findPreviousNodeInSameColumn(get().mindmap!.nodes, id);
    if (previousNode) {
      get().updateSelectedNode(previousNode);
    }
  },
  selectNextNodeInSameColumn: () => {
    const id = get().selectedNode?.id!;
    const nextNode = findNextNodeInSameColumn(get().mindmap!.nodes, id);
    if (nextNode) {
      get().updateSelectedNode(nextNode);
    }
  },
  selectParentNode: () => {
    const id = get().selectedNode?.id!;
    const parentNode = findParentNodeId(get().mindmap!.edges, id);
    if (parentNode) {
      get().updateSelectedNode(parentNode);
    }
  },
  selectFirstChildNode: () => {
    const id = get().selectedNode?.id!;
    const firstChild = findFirstChildNode(get().mindmap!, id);
    if (firstChild) {
      get().updateSelectedNode(firstChild);
    }
  }
}));

// After creating the store, set the initial selected node
useStore.setState((state) => ({
  selectedNode: state.mindmap?.nodes[0] || null
}));

export default useStore;
