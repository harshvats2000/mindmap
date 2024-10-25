import React from "react";
import ReactDOM from "react-dom/client";

// all styles for this example app are in the index.css file to keep it as simple as possible
import "./index.css";
import AuthenticatedApp from "./App/AuthenticatedApp";

// we need to wrap our app in the ReactFlowProvider to be able to use the React Flow hooks in our App component
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <>
    <AuthenticatedApp />
  </>
);
