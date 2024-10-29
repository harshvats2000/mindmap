import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Panel } from "@xyflow/react";

export const KeyboardShortcutsDialog = () => {
  const shortcuts = [
    { key: "Tab", description: "Add child" },
    { key: "Enter", description: "Edit" },
    { key: "Shift + Enter", description: "Add sibling" },
    { key: "Backspace", description: "Delete node and children" }
  ];

  return (
    <Panel position="bottom-right">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="absolute bottom-4 right-4 hidden xl:block">
            Keyboard Shortcuts
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Keyboard Shortcuts</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            {shortcuts.map((shortcut) => (
              <div key={shortcut.key} className="flex justify-between">
                <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">
                  {shortcut.key}
                </kbd>
                <span className="text-sm">{shortcut.description}</span>
              </div>
            ))}
            <div className="flex justify-between">
              <div className="flex gap-2">
                {["↑", "↓", "←", "→"].map((key) => (
                  <kbd
                    key={key}
                    className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg"
                  >
                    {key}
                  </kbd>
                ))}
              </div>
              <span className="text-sm">Navigate</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Panel>
  );
};
