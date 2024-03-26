import { useState } from "react";
import { SelectedNodeContext } from "./Contexts.js";

export default function SelectedNodeContextProvider({ children }) {
  const [selectedNode, setSelectedNode] = useState({});

  return (
    <SelectedNodeContext.Provider value={{ selectedNode, setSelectedNode }}>
      {children}
    </SelectedNodeContext.Provider>
  );
}
