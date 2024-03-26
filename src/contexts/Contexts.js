import { createContext } from "react";

export const FlowListContext = createContext({
  flowList: [],
  setFlowList: () => {},
});

export const SelectedNodeContext = createContext({
  selectedNode: {},
  setSelectedNode: () => {},
});
