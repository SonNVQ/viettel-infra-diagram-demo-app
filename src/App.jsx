import { useRef } from "react";
import { ReactFlowProvider } from "reactflow";
import Index from "./components/FlowEditor/index.jsx";
import Sidebar from "./components/Sidebar.jsx";
import FlowListContextProvider from "./contexts/FlowListContextProvider.jsx";
import SelectedNodeContextProvider from "./contexts/SelectedNodeContextProvider.jsx";

export default function App() {
  const reactFlowWrapper = useRef(null);

  return (
    <>
      <div className="dndflow">
        <FlowListContextProvider>
          <SelectedNodeContextProvider>
            <ReactFlowProvider>
              <div className="reactflow-wrapper" ref={reactFlowWrapper}>
                <Index />
              </div>
              <Sidebar />
            </ReactFlowProvider>
          </SelectedNodeContextProvider>
        </FlowListContextProvider>
      </div>
    </>
  );
}
