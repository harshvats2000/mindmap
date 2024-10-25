import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import useStore from "./store";
import Dashboard from "./components/Dashboard";
import AuthenticatedFlow from "./components/AuthenticatedFlow";
import App from "./index1";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { ReactFlowProvider } from "@xyflow/react";

const AuthenticatedApp = () => {
  const { user, setIsAuthenticating, setUser, isAuthenticating } = useStore();

  useEffect(() => {
    setIsAuthenticating(true);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setIsAuthenticating(false);
    });

    return () => unsubscribe();
  }, []);

  if (isAuthenticating) {
    return <div>Loading...</div>;
  }

  return (
    <ReactFlowProvider>
      <Router>
        <Routes>
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
          <Route path="/mindmap/:id" element={user ? <AuthenticatedFlow /> : <Navigate to="/" />} />
          <Route path="/" element={<App />} />
        </Routes>
      </Router>
    </ReactFlowProvider>
  );
};

export default AuthenticatedApp;
