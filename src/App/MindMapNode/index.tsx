import { useLayoutEffect, useEffect, useRef } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import { NodeData } from "../types";
// import useStore from "../store";

function MindMapNode(node: NodeProps<NodeData>) {
  const { id, data, selected } = node;

  const inputRef = useRef<HTMLInputElement>(null);
  // const updateNodeLabel = useStore((state) => state.updateNodeLabel);

  // useEffect(() => {
  //   setTimeout(() => {
  //     inputRef.current?.focus({ preventScroll: true });
  //   }, 1);
  // }, []);

  useLayoutEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.width = `${data.label.length * 8}px`;
    }
  }, [data.label.length]);

  return (
    <div className="dragHandle">
      <div className="inputWrapper" style={{ background: selected ? "blue" : "red", color: "white" }}>
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

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Top} />
    </div>
  );
}

export default MindMapNode;
