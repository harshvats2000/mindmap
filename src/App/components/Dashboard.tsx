import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import useStore from "../store";
import { Link, useNavigate } from "react-router-dom";
import { darkenHexColor } from "../helpers";
import { IMindmap } from "../types";
import { MoreVertical, Trash, Edit, User, LogOut, PartyPopper, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signOut } from "firebase/auth";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const [mindmaps, setMindmaps] = useState<IMindmap[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, bgColor, createMindmap } = useStore();
  const navigate = useNavigate();
  const [editingMindmap, setEditingMindmap] = useState<IMindmap | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [isUpgrading, setIsUpgrading] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Error during sign out:", err);
    }
  };

  useEffect(() => {
    const fetchMindmaps = async () => {
      if (user) {
        setLoading(true);
        const q = query(collection(db, "mindmaps"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const mindmapList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setMindmaps(mindmapList as any);
        setLoading(false);
      }
    };

    fetchMindmaps();
  }, [user]);

  const createNewMindmap = async () => {
    const newMindmapId = await createMindmap();
    if (newMindmapId) {
      navigate(`/mindmap/${newMindmapId}`);
    }
  };

  const deleteMindmap = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this mindmap?")) {
      try {
        await deleteDoc(doc(db, "mindmaps", id));
        setMindmaps(mindmaps.filter((mindmap) => mindmap.id !== id));
      } catch (error) {
        console.error("Error deleting mindmap:", error);
        alert("Failed to delete mindmap. Please try again.");
      }
    }
  };

  const openEditModal = (mindmap: IMindmap) => {
    setEditingMindmap(mindmap);
    setNewTitle(mindmap.title || "");
  };

  const closeEditModal = () => {
    setEditingMindmap(null);
    setNewTitle("");
  };

  const updateMindmapTitle = async () => {
    if (editingMindmap && newTitle.trim()) {
      try {
        await updateDoc(doc(db, "mindmaps", editingMindmap.id), { title: newTitle.trim() });
        setMindmaps(mindmaps.map((m) => (m.id === editingMindmap.id ? { ...m, title: newTitle.trim() } : m)));
        closeEditModal();
      } catch (error) {
        console.error("Error updating mindmap title:", error);
        alert("Failed to update mindmap title. Please try again.");
      }
    }
  };

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    const token = await user?.getIdToken();
    try {
      const createOrderResponse = await fetch("https://mindmap-backend-ivory.vercel.app/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      if (!createOrderResponse.ok) {
        throw new Error("Failed to create order");
      }

      const { order_id } = await createOrderResponse.json();

      // Load Razorpay script dynamically
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        setIsUpgrading(false);
        const options = {
          key: "rzp_test_UsuP0ivlOkiuGA",
          order_id: order_id,
          name: "Mindmap",
          description: "Premium Upgrade",
          notes: {
            userId: user?.uid
          },
          handler: async function (response: any) {
            console.log("Payment successful:", response);
            // Reload the page after successful payment
            window.location.reload();
          },
          prefill: {
            email: user?.email
          }
        };

        const paymentObject = new (window as any).Razorpay(options);
        paymentObject.open();
      };
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert("Failed to initiate payment. Please try again.");
      setIsUpgrading(false);
    }
  };

  const MindmapSkeleton = () => (
    <div className="p-4 border rounded-lg">
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );

  // useEffect(() => {
  //   (async () => {
  //     const token = await user?.getIdToken();
  //     console.log(token, user);
  //   })();
  // }, [user]);

  return (
    <div className="p-6 relative max-w-screen-lg mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mindmaps</h1>
        <div className="flex flex-row gap-2">
          <Button variant="outline" className="flex items-center gap-2" onClick={createNewMindmap}>
            <User className="h-4 w-4" />
            New MindMap
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                {isUpgrading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <User className="h-4 w-4" />
                    Account
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem disabled className="flex flex-col items-start">
                <span>Signed in as</span>
                <span className="-mt-2 text-xs">{user?.email}</span>
              </DropdownMenuItem>
              <Separator />
              <DropdownMenuItem onClick={handleUpgrade} className="mt-2">
                <PartyPopper className="mr-2 h-4 w-4" />
                <span>Upgrade</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut} className="mt-2">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <>
            <MindmapSkeleton />
            <MindmapSkeleton />
            <MindmapSkeleton />
          </>
        ) : (
          mindmaps.map((mindmap) => (
            <div key={mindmap.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow relative">
              <Link to={`/mindmap/${mindmap.id}`} className="block">
                <h2 className="text-lg font-semibold">{mindmap.title || "Untitled Mindmap"}</h2>
                <p className="text-sm text-gray-500">
                  Created: {new Date(mindmap.createdAt.seconds * 1000).toLocaleDateString()}
                </p>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0 absolute top-2 right-2">
                    <span className="sr-only">Open menu</span>
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => openEditModal(mindmap)}>
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Edit</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault();
                      deleteMindmap(mindmap.id);
                    }}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))
        )}
      </div>

      <Dialog open={!!editingMindmap} onOpenChange={() => closeEditModal()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Mindmap Title</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newTitle}
                onChange={(e: any) => setNewTitle(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={closeEditModal} variant="outline">
              Cancel
            </Button>
            <Button onClick={updateMindmapTitle}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
