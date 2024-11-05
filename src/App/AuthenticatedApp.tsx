import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import useStore from "./store";
import Dashboard from "./components/Dashboard";
import AuthenticatedFlow from "./components/AuthenticatedFlow";
import App from "./index1";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { ReactFlowProvider } from "@xyflow/react";
import FlowChart from "./flowchart";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { IUser } from "./types";

const AuthenticatedApp = () => {
  const { setIsAuthenticating, setUser, isAuthenticating } = useStore();

  useEffect(() => {
    setIsAuthenticating(true);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          setUser(firebaseUser as any);
          setIsAuthenticating(false);

          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

          if (userDoc.exists()) {
            const userData = {
              ...userDoc.data()
            };

            setUser(userData as IUser);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
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
          <Route path="/flowchart" element={<FlowChart />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/mindmap/:id" element={<AuthenticatedFlow />} />
          <Route path="/" element={<App />} />
        </Routes>
      </Router>
    </ReactFlowProvider>
  );
};

export default AuthenticatedApp;
