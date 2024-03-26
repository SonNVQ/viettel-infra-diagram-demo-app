import { FlowListContext } from "./Contexts.js";
import { useState } from "react";

export default function FlowListContextProvider({ children }) {
  const [flowList, setFlowList] = useState([]);

  return (
    <FlowListContext.Provider value={{ flowList, setFlowList }}>
      {children}
    </FlowListContext.Provider>
  );
}
