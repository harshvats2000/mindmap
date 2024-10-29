import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check, Loader2, Zap } from "lucide-react";
import axios from "axios";
import useStore, { RFState } from "../store";
import { selector } from "../types";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  const { user } = useStore<RFState>(selector);
  const [loading, setLoading] = React.useState(false);
  const [showMessage, setShowMessage] = React.useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    await axios.post("https://mindmap-backend-ivory.vercel.app/notify-discord", {
      message: `${user?.email} clicked on the upgrade button`
    });
    setLoading(false);
    setShowMessage(true);

    // Close the modal after 5 seconds
    setTimeout(() => {
      setShowMessage(false);
      onClose();
    }, 5000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]" onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            <span className="bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
              Upgrade to Lifetime Plan
            </span>
          </DialogTitle>
        </DialogHeader>

        {showMessage ? (
          <Card className="border-0 shadow-none">
            <CardContent className="text-center">
              <p className="text-lg font-semibold mb-2">Thank you for your interest!</p>
              <p>The creator will be in touch with you shortly via email to complete the payment process.</p>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-0 shadow-none">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-center">Lifetime Plan Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {[
                  "Unlimited Nodes",
                  "Download as HTML",
                  "Share board with others",
                  "Custom Node colors",
                  "Early access to new features"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-center">
                <p className="text-2xl font-bold">$20/year</p>
                <p className="text-sm text-muted-foreground">Billed annually</p>
              </div>
              <Button
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105"
                onClick={handleUpgrade}
                disabled={loading}
                autoFocus={false}
              >
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Zap className="w-4 h-4 mr-2" />}
                Upgrade Now
              </Button>
            </CardFooter>
          </Card>
        )}

        {!showMessage && (
          <DialogFooter>
            <Button onClick={onClose} variant="outline" className="w-full">
              Maybe Later
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
