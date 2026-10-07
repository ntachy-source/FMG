import { useState, useEffect } from "react";
import { Download, Smartphone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AndroidInstallModal } from "./AndroidInstallModal";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export const AndroidInstallBanner = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    // Check if already running as installed standalone Android app
    const checkStandalone = window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(checkStandalone);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (isStandalone || dismissed) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
          setDeferredPrompt(null);
          return;
        }
      } catch {}
    }
    setModalOpen(true);
  };

  return (
    <>
      <div className="bg-primary/10 border-b border-primary/20 px-4 py-2 flex items-center justify-between gap-3 text-sm animate-in fade-in slide-in-from-top-2">
        <div className="flex items-center gap-2 text-foreground font-medium text-xs sm:text-sm">
          <Smartphone className="h-4 w-4 text-primary shrink-0" />
          <span>Install <strong>DigiTech POS</strong> Android Native App on your device</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button size="sm" onClick={handleInstallClick} className="gap-1.5 h-7 sm:h-8 text-xs font-medium">
            <Download className="h-3.5 w-3.5" />
            Install App
          </Button>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <AndroidInstallModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        deferredPrompt={deferredPrompt}
      />
    </>
  );
};
