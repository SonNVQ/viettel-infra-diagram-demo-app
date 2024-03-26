import { useContext } from "react";
import { SelectedNodeContext } from "../contexts/Contexts.js";

export default function InfoSection() {
  const { selectedNode: node } = useContext(SelectedNodeContext);

  return (
    <>
      <div>
        <p>Id: {node?.id}</p>
        <p>Label: {node?.data?.label}</p>
      </div>
    </>
  );
}
