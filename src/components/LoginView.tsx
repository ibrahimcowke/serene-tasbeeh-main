import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { toast } from 'sonner';
import { Cloud, RefreshCw, Key, HelpCircle, CheckCircle, LogOut, ArrowLeft, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
    getStoredClientId,
    getAccessToken,
    disconnectGoogleDrive,
    authorizeGoogleDrive,
    handleOAuthCallback,
    uploadBackup,
    downloadBackup
} from '@/lib/googleDrive';

interface LoginViewProps {
    children: React.ReactNode;
}

export function LoginView({ children }: LoginViewProps) {
    const [clientId, setClientId] = useState(getStoredClientId());
    const [isConnected, setIsConnected] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const store = useTasbeehStore();

    // Check auth state on mount and handle OAuth callback redirects
    useEffect(() => {
        const wasRedirected = handleOAuthCallback();
        if (wasRedirected) {
            toast.success("Successfully connected to Google Drive!");
        }

        const token = getAccessToken();
        setIsConnected(!!token);
    }, []);

    const handleConnect = (e: React.FormEvent) => {
        e.preventDefault();
        if (!clientId.trim()) {
            toast.error("Please enter a valid Google Client ID");
            return;
        }

        try {
            authorizeGoogleDrive(clientId);
        } catch (error: any) {
            toast.error(error.message || "Failed to initiate authorization");
        }
    };

    const handleDisconnect = () => {
        disconnectGoogleDrive();
        setIsConnected(false);
        toast.info("Disconnected from Google Drive");
    };

    const handleBackup = async () => {
        const token = getAccessToken();
        if (!token) {
            setIsConnected(false);
            toast.error("Session expired. Please reconnect to Google Drive.");
            return;
        }

        setSyncing(true);
        try {
            const data = store.exportData(); // Export local Zustand store data as string
            await uploadBackup(token, data);
            toast.success("Data successfully backed up to your Google Drive!");
        } catch (error: any) {
            console.error("Backup error:", error);
            toast.error("Failed to backup data to Google Drive. Check permissions.");
        } finally {
            setSyncing(false);
        }
    };

    const handleRestore = async () => {
        const token = getAccessToken();
        if (!token) {
            setIsConnected(false);
            toast.error("Session expired. Please reconnect to Google Drive.");
            return;
        }

        setSyncing(true);
        try {
            const dataStr = await downloadBackup(token);
            const success = store.importData(dataStr);
            if (success) {
                toast.success("Data successfully restored from Google Drive!");
            } else {
                toast.error("Failed to parse the backup file.");
            }
        } catch (error: any) {
            console.error("Restore error:", error);
            toast.error("Failed to restore data. Make sure a backup exists on your Drive.");
        } finally {
            setSyncing(false);
        }
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent side="bottom" className="bg-sheet-bg rounded-t-3xl h-[85vh] overflow-y-auto">
                <SheetDescription className="sr-only">
                    Backup and sync your spiritual progress using Google Drive.
                </SheetDescription>
                <div className="sheet-handle" />
                <SheetHeader className="text-left pb-4">
                    <SheetTitle className="text-lg font-medium">Google Drive Sync</SheetTitle>
                </SheetHeader>

                <div className="space-y-6 pb-12">
                    {isConnected ? (
                        <div className="space-y-6">
                            {/* Connected Card */}
                            <div className="p-4 rounded-2xl bg-card border border-border/50 flex items-start gap-4">
                                <div className="p-2.5 rounded-full bg-emerald-500/10 text-emerald-500">
                                    <CheckCircle className="w-6 h-6" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <h4 className="text-sm font-semibold text-foreground">Connected to Google Drive</h4>
                                    <p className="text-xs text-muted-foreground">
                                        Your backups will be saved in your personal Google Drive account under the file name <code className="bg-muted px-1.5 py-0.5 rounded text-[10px]">tasbeehly_backup.json</code>.
                                    </p>
                                </div>
                            </div>

                            {/* Sync Controls */}
                            <div className="space-y-3">
                                <button 
                                    onClick={handleBackup}
                                    disabled={syncing}
                                    className="w-full flex items-center justify-between p-4 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <Cloud className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                                        <span className="text-sm font-medium text-primary">Backup to Google Drive</span>
                                    </div>
                                    {syncing && <RefreshCw className="w-4 h-4 text-primary animate-spin" />}
                                </button>

                                <button 
                                    onClick={handleRestore}
                                    disabled={syncing}
                                    className="w-full flex items-center justify-between p-4 rounded-xl bg-card hover:bg-muted border border-border/50 transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <RefreshCw className="w-5 h-5 text-foreground/80 group-hover:rotate-180 transition-transform duration-500" />
                                        <span className="text-sm font-medium text-foreground/80">Restore from Google Drive</span>
                                    </div>
                                </button>
                            </div>

                            {/* Disconnect Button */}
                            <button 
                                onClick={handleDisconnect}
                                className="w-full flex items-center justify-center gap-2 p-3.5 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-500/20"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="text-sm font-medium">Disconnect Storage</span>
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Setup Form */}
                            <form onSubmit={handleConnect} className="space-y-4 p-4 rounded-2xl bg-card border border-border/50">
                                <div className="space-y-2">
                                    <h3 className="text-sm font-semibold text-foreground">Connect Your Personal Storage</h3>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        Save your counts, history, and settings securely. Your data remains fully private inside your own Google Drive.
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <div className="relative">
                                        <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <Input 
                                            type="text" 
                                            placeholder="Enter Google OAuth Client ID" 
                                            value={clientId}
                                            onChange={(e) => setClientId(e.target.value)}
                                            className="pl-9 bg-background/50 border-border/50 rounded-xl"
                                            required
                                        />
                                    </div>
                                </div>

                                <button 
                                    type="submit"
                                    className="w-full p-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm flex justify-center items-center gap-2 hover:opacity-90 transition-opacity"
                                >
                                    Connect Google Drive
                                </button>
                            </form>

                            {/* Setup Instructions Accordion */}
                            <div className="p-4 rounded-2xl bg-muted/40 border border-border/40 space-y-3">
                                <button 
                                    onClick={() => setShowInstructions(!showInstructions)}
                                    className="w-full flex items-center justify-between text-xs font-semibold text-foreground/80 hover:text-foreground transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        <HelpCircle className="w-4 h-4 text-primary" />
                                        <span>How to generate a Google Client ID?</span>
                                    </div>
                                    <ArrowLeft className={`w-3.5 h-3.5 transition-transform duration-300 ${showInstructions ? '-rotate-90' : 'rotate-180'}`} />
                                </button>

                                {showInstructions && (
                                    <div className="text-[11px] text-muted-foreground space-y-3 pt-2 border-t border-border/30 leading-relaxed">
                                        <p>To use Google Drive sync, you need to register a free client ID in your Google Cloud account:</p>
                                        <ol className="list-decimal pl-4 space-y-2">
                                            <li>Go to the <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Google Cloud Console</a>.</li>
                                            <li>Create a new project (e.g., <strong>Tasbeehly</strong>).</li>
                                            <li>Search for <strong>Google Drive API</strong> and click <strong>Enable</strong>.</li>
                                            <li>Configure your <strong>OAuth Consent Screen</strong>:
                                                <ul className="list-disc pl-4 mt-1 space-y-1">
                                                    <li>Set User Type to <strong>External</strong>.</li>
                                                    <li>Add the scope: <code className="bg-muted px-1 py-0.2 rounded text-[10px]">.../auth/drive.file</code> (only access files created by this app).</li>
                                                </ul>
                                            </li>
                                            <li>Go to <strong>Credentials</strong>, click <strong>+ Create Credentials</strong>, and select <strong>OAuth client ID</strong>.</li>
                                            <li>Choose <strong>Web Application</strong> as the type.</li>
                                            <li>Under <strong>Authorized JavaScript origins</strong> and <strong>Redirect URIs</strong>, add:
                                                <ul className="list-disc pl-4 mt-1 space-y-1">
                                                    <li>Your local URL: <code className="bg-muted px-1 py-0.2 rounded text-[10px]">http://localhost:8080</code></li>
                                                    <li>Your web domain (e.g. your Netlify site URL).</li>
                                                </ul>
                                            </li>
                                            <li>Copy the generated <strong>Client ID</strong> and paste it into the input field above.</li>
                                        </ol>
                                        <div className="flex items-start gap-2 p-2 rounded-lg bg-primary/5 text-primary border border-primary/10">
                                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                            <span><strong>Note:</strong> Your Client ID is completely public and safe to paste here. Backups are stored privately on your personal Google Drive and never touch external servers.</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}


