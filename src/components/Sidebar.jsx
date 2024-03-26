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
        <p>
          <h3>Instruction</h3>
          <ul>
            <li>Kéo thả Default Node/Oval Node để tạo các node</li>
            <li>Có thể nhấn trực tiếp vào label các node để sửa</li>
            {/*<li>*/}
            {/*  Màu <span style={{ color: "green" }}>xanh</span> thể hiện cổng*/}
            {/*  source(out)*/}
            {/*</li>*/}
            {/*<li>*/}
            {/*  Màu <span style={{ color: "red" }}>đỏ</span> thể hiện cổng*/}
            {/*  target(in)*/}
            {/*</li>*/}
            <li>
              Khi thực hiện kết nối các node, node
              <span style={{ color: "red" }}> target </span> sẽ được gán tự động parentId từ node
              <span style={{ color: "green" }}> source </span>. Mỗi node chỉ có duy nhất 1 node parent. Nếu node
              <span style={{ color: "red" }}> target </span> đã có parentId thì sẽ bị ghi đè.
            </li>
            <li>Chọn và nhấn phím Backspace(phím xoá) trên bàn phím để xoá các Node/Cạnh</li>
            <li>Lăn chuột để zoom in/zoom out</li>
          </ul>
        </p>
        <i>
          <a href="https://github.com/SonNVQ/viettel-infra-diagram-demo-app" target="_blank">
            https://github.com/SonNVQ/viettel-infra-diagram-demo-app
          </a>
        </i>
      </div>
    </aside>
  );
}
