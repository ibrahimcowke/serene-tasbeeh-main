import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Download, X } from "lucide-react";
import { Button } from "./ui/button";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const PWAInstallPrompt = () => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      const promptEvent = e as BeforeInstallPromptEvent;
      setInstallPrompt(promptEvent);
      // Show the install button/toast after a short delay
      setTimeout(() => setIsVisible(true), 3000);
      console.log("PWA: beforeinstallprompt captured and custom UI scheduled.");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;

    // Show the install prompt
    await installPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await installPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);

    // We've used the prompt, and can't use it again, throw it away
    setInstallPrompt(null);
    setIsVisible(false);
  };

  if (!isVisible || !installPrompt) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 z-[100] md:left-auto md:right-4 md:w-80 animate-fade-in-up">
      <div className="bg-card/80 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-4 flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Download className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Install App</h3>
              <p className="text-xs text-muted-foreground">Add tasbeehdikr to your home screen</p>
            </div>
          </div>
          <button 
            onClick={() => setIsVisible(false)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <Button 
          onClick={handleInstallClick}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl h-10"
        >
          Install Now
        </Button>
      </div>
    </div>
  );
};
