import { Panel } from "@xyflow/react";
import BgColorPicker from "./ColorPicker";
import { selectorPlay } from "@/App/types";
import useStore, { RFStatePlay } from "@/App/store-play";
import { darkenHexColor } from "@/App/helpers";
import { DownloadButton } from "./DownloadBtn";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/firebase";

const MyPanel = () => {
  const { bgColor } = useStore<RFStatePlay>(selectorPlay);

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <div>
      <Panel position="top-left">
        <button className="btn" style={{ backgroundColor: darkenHexColor(bgColor, 20) }} onClick={handleGoogleSignIn}>
          Login
        </button>
      </Panel>
      <Panel position="top-right">
        <div className="flex flex-row gap-2">
          <BgColorPicker />
          <DownloadButton />
        </div>
      </Panel>
    </div>
  );
};

export default MyPanel;
