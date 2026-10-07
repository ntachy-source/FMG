import { useState, useEffect } from "react";
import QRCode from "qrcode";
import { Smartphone, Download, ExternalLink, Check, Copy, Sparkles, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deferredPrompt?: any;
}

export const AndroidInstallModal = ({ open, onOpenChange, deferredPrompt }: Props) => {
  const [qrUrl, setQrUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const appUrl = typeof window !== "undefined" ? window.location.href : "";

  useEffect(() => {
    if (appUrl) {
      QRCode.toDataURL(appUrl, { width: 220, margin: 2, color: { dark: "#0f172a", light: "#ffffff" } })
        .then((url) => setQrUrl(url))
        .catch(() => {});
    }
  }, [appUrl]);

  const handleNativeInstall = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
          toast.success("DigiTech POS installed successfully!");
          onOpenChange(false);
          return;
        }
      } catch (err) {
        console.warn("Native install error:", err);
      }
    }
    // Fallback if inside iframe or already prompted
    window.open(appUrl, "_blank");
  };

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(appUrl);
      setCopied(true);
      toast.success("App URL copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy link");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader className="text-center sm:text-left">
          <div className="flex items-center gap-2 text-primary font-semibold mb-1">
            <Smartphone className="h-5 w-5" />
            <span>Install Native Android App</span>
          </div>
          <DialogTitle className="text-xl">Install DigiTech POS</DialogTitle>
          <DialogDescription>
            Install DigiTech POS directly onto your Android phone or tablet for fast hardware scanning, offline access, and full-screen experience.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-2">
          {deferredPrompt ? (
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-center space-y-3">
              <Sparkles className="h-8 w-8 text-primary mx-auto animate-pulse" />
              <div>
                <p className="font-semibold text-foreground">One-Click Android Install Ready</p>
                <p className="text-xs text-muted-foreground">Click below to trigger the Android system install prompt.</p>
              </div>
              <Button onClick={handleNativeInstall} className="w-full gap-2">
                <Download className="h-4 w-4" /> Install Now on Android
              </Button>
            </div>
          ) : (
            <>
              {qrUrl && (
                <div className="flex flex-col items-center justify-center p-4 bg-muted/30 rounded-xl border border-border">
                  <p className="text-xs font-medium text-muted-foreground mb-2 text-center">
                    Scan with your Android phone's camera:
                  </p>
                  <img src={qrUrl} alt="Scan to install" className="w-44 h-44 rounded-lg bg-white p-2 shadow-sm" />
                </div>
              )}

              <div className="space-y-2 text-xs text-muted-foreground bg-muted/40 p-3 rounded-lg border border-border">
                <p className="font-semibold text-foreground text-sm flex items-center gap-1.5">
                  <Smartphone className="h-4 w-4 text-primary" /> How to install on Android Chrome:
                </p>
                <ol className="list-decimal list-inside space-y-1 pl-1">
                  <li>Open this app in <strong>Chrome</strong> on your Android device.</li>
                  <li>Tap the <strong>⋮ (three dots)</strong> menu in the top right.</li>
                  <li>Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</li>
                  <li>The app will install as a standalone native Android icon on your device!</li>
                </ol>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 text-xs gap-1.5" onClick={handleCopyLink}>
                  {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied Link" : "Copy App Link"}
                </Button>
                <Button className="flex-1 text-xs gap-1.5" onClick={() => window.open(appUrl, "_blank")}>
                  <ExternalLink className="h-3.5 w-3.5" />
                  Open in New Tab
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
