import { Edge, Connection, EdgeChange, addEdge, applyEdgeChanges } from "@xyflow/react";

/**
 * State getter interface for edge operations
 */
type EdgeStateGetter = () => { edges: Edge[] };

/**
 * State setter interface for edge operations
 */
type EdgeStateSetter = (partial: { edges: Edge[] }) => void;

/**
 * Context provided to edge action creators
 */
interface EdgeActionsContext {
  get: EdgeStateGetter;
  set: EdgeStateSetter;
  takeSnapshot: () => void;
}

/**
 * Creates edge management actions
 *
 * @param context - Zustand get/set functions and history snapshot
 * @returns Object with edge action methods
 */
export const createEdgeActions = ({ get, set, takeSnapshot }: EdgeActionsContext) => ({
  /**
   * Replaces all edges with a new array
   *
   * @param edges - New edges array
   */
  setEdges: (edges: Edge[]) => set({ edges }),

  /**
   * Applies React Flow edge changes (selection, removal, etc.)
   *
   * @param changes - Array of edge changes from React Flow
   */
  onEdgesChange: (changes: EdgeChange[]) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },

  /**
   * Creates a new edge connection between two nodes
   * Automatically sets edge type to "dataFlow"
   *
   * @param connection - Connection object from React Flow (source, target, handles)
   */
  onConnect: (connection: Connection) => {
    takeSnapshot();
    set({ edges: addEdge({ ...connection, type: "dataFlow" }, get().edges) });
  },

  /**
   * Updates an existing edge to connect to new nodes/handles
   *
   * @param oldEdge - The edge to be reconnected
   * @param newConnection - New connection details (source, target, handles)
   */
  reconnectEdge: (oldEdge: Edge, newConnection: Connection) => {
    takeSnapshot();
    set({
      edges: get().edges.map((edge) =>
        edge.id === oldEdge.id
          ? { ...edge, source: newConnection.source!, target: newConnection.target! }
          : edge
      ),
    });
  },
});
