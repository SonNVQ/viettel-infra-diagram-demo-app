import { memo } from "react";
import { Handle, Position, NodeResizer } from "reactflow";
import EdiText from "react-editext";

const ResizableNode = ({ id, data, selected, isConnectable }) => {
  const {
    hideChildNodesRecursive,
    showChildNodeOneLevel,
    showChildNodesRecursive,
  } = data;

  return (
    <div>
      <NodeResizer
        color="#ff0071"
        isVisible={selected}
        minWidth={100}
        minHeight={30}
      />
      <div style={{ padding: 10 }}>
        <EdiText
          type="textarea"
          editOnViewClick={true}
          editButtonClassName={"editext-editButton"}
          onSave={(v) => (data.label = v)}
          value={data.label}
        />
        <button
          onClick={() => {
            console.log(data);
            hideChildNodesRecursive(id);
          }}
        >
          -
        </button>
        <button onClick={() => showChildNodeOneLevel(id)}>+</button>
        <button onClick={() => showChildNodesRecursive(id)}>+++</button>
      </div>

      {/*<Handle*/}
      {/*  type="source"*/}
      {/*  position={Position.Top}*/}
      {/*  id="st"*/}
      {/*  isConnectable={isConnectable}*/}
      {/*  // style={{ left: "46%", backgroundColor: "green" }}*/}
      {/*/>*/}
      <Handle
        type="target"
        position={Position.Top}
        id="tt"
        isConnectable={isConnectable}
        // style={{ left: "54%", backgroundColor: "red" }}
      />

      {/*<Handle*/}
      {/*  type="target"*/}
      {/*  position={Position.Bottom}*/}
      {/*  id="tb"*/}
      {/*  isConnectable={isConnectable}*/}
      {/*  style={{ left: "46%", backgroundColor: "red" }}*/}
      {/*/>*/}
      <Handle
        type="source"
        position={Position.Bottom}
        id="sb"
        isConnectable={isConnectable}
        // style={{ left: "54%", backgroundColor: "green" }}
      />

      <Handle
        type="source"
        position={Position.Right}
        id="sr"
        isConnectable={isConnectable}
        // style={{ top: "38%", backgroundColor: "green" }}
      />
      {/*<Handle*/}
      {/*  type="target"*/}
      {/*  position={Position.Right}*/}
      {/*  id="tr"*/}
      {/*  isConnectable={isConnectable}*/}
      {/*  style={{ top: "62%", backgroundColor: "red" }}*/}
      {/*/>*/}

      <Handle
        type="target"
        position={Position.Left}
        id="tl"
        isConnectable={isConnectable}
        // style={{ top: "38%", backgroundColor: "red" }}
      />
      {/*<Handle*/}
      {/*  type="source"*/}
      {/*  position={Position.Left}*/}
      {/*  id="sl"*/}
      {/*  isConnectable={isConnectable}*/}
      {/*  style={{ top: "62%", backgroundColor: "green" }}*/}
      {/*/>*/}
    </div>
  );
};

export default memo(ResizableNode);
