import React, { useState, useEffect } from "react";
import { auth, db, googleProvider } from "../../firebase";
import { signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { selector } from "../types";
import useStore, { RFState } from "../store";
import { darkenHexColor } from "../helpers";

const Auth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { bgColor } = useStore<RFState>(selector);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      setError(null);
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        await setDoc(
          doc(db, "users", result.user.uid),
          {
            id: result.user.uid,
            name: result.user.displayName || "Anonymous",
            email: result.user.email
          },
          { merge: true }
        );
      }
    } catch (err) {
      setError((err as Error).message);
      console.error("Error during sign in:", err);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Error during sign out:", err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return (
      <div>
        <p>Welcome, {user.displayName || user.email}!</p>
        <button className="btn" style={{ backgroundColor: darkenHexColor(bgColor, 20) }} onClick={handleSignOut}>
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div>
      <button className="btn" style={{ backgroundColor: darkenHexColor(bgColor, 20) }} onClick={handleSignIn}>
        Sign In with Google
      </button>
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default Auth;
