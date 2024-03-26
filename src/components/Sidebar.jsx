import InfoSection from "./InfoSection.jsx";

export default function Sidebar({ currentNode }) {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside style={{fontSize: "16px"}}>
      <div>
        <div className="description">
          You can drag these nodes to the pane on the right.
        </div>
        <div
          className="dndnode"
          onDragStart={(event) => onDragStart(event, "defaultNode")}
          draggable
        >
          Default Node
        </div>
        <div
          className="dndnode"
          onDragStart={(event) => onDragStart(event, "ovalNode")}
          draggable
        >
          Oval Node
        </div>
      </div>
      <InfoSection node={currentNode} />
      <div style={{ marginTop: "20px;" }}>
          <a href="https://github.com/SonNVQ/viettel-infra-diagram-demo-app" target="_blank">
            https://github.com/SonNVQ/viettel-infra-diagram-demo-app
          </a>
      </div>
    </aside>
  );
}
