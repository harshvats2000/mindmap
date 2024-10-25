import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC2iMuhjFoygY08hPdyaY3FpbbDzZyknRY",
  authDomain: "notemap-56ad4.firebaseapp.com",
  projectId: "notemap-56ad4",
  storageBucket: "notemap-56ad4.appspot.com",
  messagingSenderId: "289007000735",
  appId: "1:289007000735:web:1e5e25037a4a91610256aa"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
