import { useLayoutEffect, useEffect, useRef } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import { NodeData, selector } from "../types";
import useStore from "../store";
// import useStore from "../store";

function MindMapNode(node: NodeProps<NodeData>) {
  const { id, data } = node;
  const { selectedNode } = useStore(selector);

  const inputRef = useRef<HTMLInputElement>(null);
  // const updateNodeLabel = useStore((state) => state.updateNodeLabel);

  // useEffect(() => {
  //   setTimeout(() => {
  //     inputRef.current?.focus({ preventScroll: true });
  //   }, 1);
  // }, []);

  // useLayoutEffect(() => {
  //   if (inputRef.current) {
  //     inputRef.current.style.width = `${data.label.length * 8}px`;
  //   }
  // }, [data.label.length]);

  return (
    <div className="dragHandle">
      <div className="inputWrapper" style={{ background: selectedNode?.id === id ? "blue" : "black", color: "white" }}>
        {/* <div className="">
          <DragIcon />
        </div> */}
        {/* <input
          value={data.label}
          onChange={(evt) => updateNodeLabel(id, evt.target.value)}
          className="input"
          ref={inputRef}
        /> */}
        {data.label}
      </div>

      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

export default MindMapNode;
