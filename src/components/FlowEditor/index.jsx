import { useState, useCallback, useRef, useContext, useEffect } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  Panel,
  getIncomers,
  getOutgoers,
  getConnectedEdges,
  updateEdge,
} from "reactflow";
import "reactflow/dist/style.css";
import { v4 as uuidv4 } from "uuid";
import NODE_STYLES from "./NodeStyles.js";
import NODE_TYPES from "./NodeTypes.js";
import { SelectedNodeContext } from "../../contexts/Contexts.js";

const FLOW_KEY = "example-flow";

const INITIAL_NODES = [
  { id: "1", data: { label: "Node 1" }, position: { x: 100, y: 100 } },
  { id: "2", data: { label: "Node 2" }, position: { x: 100, y: 200 } },
];

const INITIAL_EDGES = [{ id: "e1-2", source: "1", target: "2" }];

export default function FlowEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState(INITIAL_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(INITIAL_EDGES);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const edgeUpdateSuccessful = useRef(true);
  const { setViewport, getNode, getNodes, getEdges } = useReactFlow();
  const { setSelectedNode } = useContext(SelectedNodeContext);
  const [fileContent, setFileContent] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target.result;
      setFileContent(content);
    };

    reader.readAsText(file);
  };

  useEffect(() => {
    if (fileContent) {
      loadJSONConfig(fileContent);
    }
  }, [fileContent]);

  function loadJSONConfig(json) {
    const flow = JSON.parse(json);
    if (flow) {
      const { x = 0, y = 0, zoom = 1 } = flow.viewport;

      let nodes = flow.nodes || [];
      nodes = nodes.map((node) => {
        node.data = {
          ...node.data,
          hideChildNodesRecursive,
          showChildNodeOneLevel,
          showChildNodesRecursive,
        };
        return node;
      });

      setNodes(nodes);
      setEdges(flow.edges || []);
      setViewport({ x, y, zoom });
    }
  }

  console.log("nodes state", nodes);

  // useEffect(() => {
  //   if (localStorage.getItem(FLOW_KEY)) {
  //     onRestore();
  //   }
  // }, []);

  useEffect(() => {
    autoCorrectEdgeVisibility();
  }, [nodes]);

  const getChildNodes = useCallback((parentId) => {
    const currentNodes = getNodes();
    return currentNodes.filter((node) => node.parentNode === parentId);
  });

  const getAllChildNodes = useCallback((parentId) => {
    const childNodes = getChildNodes(parentId);
    let allChildNodes = [];
    childNodes.forEach((childNode) => {
      allChildNodes.push(childNode);
      allChildNodes = allChildNodes.concat(getAllChildNodes(childNode.id));
    });
    return allChildNodes;
  });

  const hideChildNodesRecursive = useCallback((parentId) => {
    const childNodes = getAllChildNodes(parentId);
    let currentNodes = getNodes();
    childNodes.forEach((childNode) => {
      currentNodes = currentNodes.map((node) =>
        node.id === childNode.id ? { ...node, hidden: true } : node,
      );
    });
    setNodes(() => currentNodes || []);
  });

  const showChildNodeOneLevel = useCallback((parentId) => {
    const childNodes = getChildNodes(parentId);
    let currentNodes = getNodes();
    childNodes.forEach((childNode) => {
      currentNodes = currentNodes.map((node) =>
        node.id === childNode.id ? { ...node, hidden: false } : node,
      );
    });
    setNodes(() => currentNodes || []);
  });

  const showChildNodesRecursive = useCallback((parentId) => {
    const childNodes = getAllChildNodes(parentId);
    let currentNodes = getNodes();
    childNodes.forEach((childNode) => {
      currentNodes = currentNodes.map((node) =>
        node.id === childNode.id ? { ...node, hidden: false } : node,
      );
    });
    setNodes(() => currentNodes || []);
  });

  function getEdgesByNodeId(nodeId) {
    const currentEdges = getEdges();
    return (
      currentEdges.filter(
        (edge) => edge.source === nodeId || edge.target === nodeId,
      ) || []
    );
  }

  function autoCorrectEdgeVisibility() {
    const currentNodes = getNodes();
    let currentEdges = getEdges();
    currentNodes.forEach((node) => {
      if (node.hidden === undefined || !node.hidden) {
        const showingEdges = getEdgesByNodeId(node.id);
        showingEdges.forEach((showingEdge) => {
          currentEdges = currentEdges.map((edge) =>
            edge.id === showingEdge.id ? { ...edge, hidden: false } : edge,
          );
        });
      }
    });
    currentNodes.forEach((node) => {
      if (node.hidden) {
        const hidingEdges = getEdgesByNodeId(node.id);
        hidingEdges.forEach((hidingEdge) => {
          currentEdges = currentEdges.map((edge) =>
            edge.id === hidingEdge.id ? { ...edge, hidden: true } : edge,
          );
        });
      }
    });
    setEdges(() => currentEdges || []);
  }

  const onConnect = useCallback(
    (connection) => {
      console.log("onConnect", connection);
      setEdges((eds) => addEdge(connection, eds));
      let targetNode = getNode(connection.target);
      console.log("targetNode", targetNode);
      targetNode.parentNode = connection.source;
      setNodes((nds) =>
        nds.map((node) => (node.id === targetNode.id ? targetNode : node)),
      );
    },
    [setEdges],
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      // reactFlowInstance.project was renamed to reactFlowInstance.screenToFlowPosition
      // and you don't need to subtract the reactFlowBounds.left/top anymore
      // details: https://reactflow.dev/whats-new/2023-11-10
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: uuidv4(),
        type,
        position,
        data: {
          label: `New node`,
          hideChildNodesRecursive,
          showChildNodeOneLevel,
          showChildNodesRecursive,
        },
        style: NODE_STYLES[type],
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance],
  );

  const onSave = useCallback(() => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      localStorage.setItem(FLOW_KEY, JSON.stringify(flow));
    }
  }, [reactFlowInstance]);

  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      const flow = JSON.parse(localStorage.getItem(FLOW_KEY));

      if (flow) {
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;

        let nodes = flow.nodes || [];
        nodes = nodes.map((node) => {
          node.data = {
            ...node.data,
            hideChildNodesRecursive,
            showChildNodeOneLevel,
            showChildNodesRecursive,
          };
          return node;
        });

        setNodes(nodes);
        setEdges(flow.edges || []);
        setViewport({ x, y, zoom });
      }
    };

    restoreFlow();
  }, [setNodes, setViewport]);

  const onNodesDelete = useCallback(
    (deleted) => {
      setEdges(
        deleted.reduce((acc, node) => {
          const incomers = getIncomers(node, nodes, edges);
          const outgoers = getOutgoers(node, nodes, edges);
          const connectedEdges = getConnectedEdges([node], edges);

          const remainingEdges = acc.filter(
            (edge) => !connectedEdges.includes(edge),
          );

          const createdEdges = incomers.flatMap(({ id: source }) =>
            outgoers.map(({ id: target }) => ({
              id: `${source}->${target}`,
              source,
              target,
            })),
          );

          return [...remainingEdges, ...createdEdges];
        }, edges),
      );
    },
    [nodes, edges],
  );

  const onEdgeUpdateStart = useCallback(() => {
    edgeUpdateSuccessful.current = false;
  }, []);

  const onEdgeUpdate = useCallback((oldEdge, newConnection) => {
    edgeUpdateSuccessful.current = true;
    setEdges((els) => updateEdge(oldEdge, newConnection, els));

    let oldTargetNode = oldEdge.targetNode;
    oldTargetNode.parentNode = null;

    let newTargetNode = getNode(newConnection.target);
    newTargetNode.parentNode = newConnection.source;

    setNodes((nds) =>
      nds.map((node) =>
        node.id === oldTargetNode.id || node.id === newTargetNode.id
          ? node
          : node,
      ),
    );
  }, []);

  const onEdgeUpdateEnd = useCallback((_, edge) => {
    if (!edgeUpdateSuccessful.current) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }
    edgeUpdateSuccessful.current = true;
  }, []);

  const onNodeClick = useCallback((_, node) => setSelectedNode(node), []);

  const exportData = () => {
    if (!reactFlowInstance) return;
    const flow = reactFlowInstance.toObject();
    localStorage.setItem(FLOW_KEY, JSON.stringify(flow));

    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(flow),
    )}`;
    const link = document.createElement("a");
    let name = uuidv4() + ".json";
    link.href = jsonString;
    link.download = name;
    link.click();
  };

  return (
    <div style={{ height: "96vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onNodesDelete={onNodesDelete}
        onNodeClick={onNodeClick}
        onEdgesChange={onEdgesChange}
        onEdgeUpdate={onEdgeUpdate}
        onEdgeUpdateStart={onEdgeUpdateStart}
        onEdgeUpdateEnd={onEdgeUpdateEnd}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={NODE_TYPES}
        fitView
      >
        <Panel position="top-right">
          <button onClick={onSave}>save</button>
          <button onClick={onRestore}>restore</button>
          <button onClick={exportData}>save & download json</button>
          <div>
            <input type="file" accept=".json" onChange={handleFileChange} />
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}
