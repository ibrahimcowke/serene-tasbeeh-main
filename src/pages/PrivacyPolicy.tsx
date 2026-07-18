import { motion } from 'framer-motion';
import { Shield, Lock, Database, Baby, FileText, Users, Cloud, WifiOff, Trash2, Bot, Sliders } from 'lucide-react';
import { ArrowKeyBackButton } from '@/components/ArrowKeyBackButton';

export default function PrivacyPolicy() {
    const sections = [
        {
            icon: Shield,
            title: "Our Commitment",
            content: "Tasbeehly is designed with a 'privacy-first' philosophy. We believe your spiritual practice is deeply personal. This policy complies with Google Play Store standards and explains how we collect, secure, and sync your data."
        },
        {
            icon: Bot,
            title: "AI Dhikr Companion & API Keys",
            content: "The AI Dhikr Companion operates with absolute respect for your privacy. Your secure Google AI Studio Gemini API Key and chat history are stored exclusively in your device's local storage. Chat requests are sent directly to Google's Gemini API endpoints and are never transmitted to, stored on, or processed by our servers."
        },
        {
            icon: Sliders,
            title: "Device Controls & Speech Synthesis",
            content: "For a physical counting experience and optional audio guidance, the app integrates volume key counting and Text-To-Speech (TTS) capabilities. These features are processed completely offline, utilizing your local device's hardware and system APIs. No keystrokes or audio data are logged or shared."
        },
        {
            icon: Users,
            title: "Account & Authentication Data",
            content: "When you register or sign in using Google or your Email/Password, we collect your email address and profile picture. This information is used strictly to establish your secure user account, handle verification, and authorize access to your cloud data."
        },
        {
            icon: Cloud,
            title: "Cloud Backup & Sync",
            content: "If you enable Cloud Sync, your counts, streaks, achievements, and custom dhikrs are securely synced to our Firebase Cloud database. This data is private and tied strictly to your unique authenticated User ID (UID), enabling seamless cross-device synchronization."
        },
        {
            icon: WifiOff,
            title: "Offline & Guest Mode",
            content: "We provide full access to all features via Guest Mode. When bypassed or offline, your counts, custom dhikrs, and progress stay strictly local inside your device's storage. No personal data or counting files are transmitted to our cloud servers."
        },
        {
            icon: Database,
            title: "Google Drive Sync (Alternative)",
            content: "As an alternative to Cloud Sync, you can choose to backup files directly to your personal Google Drive. This limited authentication only permits the app to access the specific files it creates ('drive.file' scope). It cannot access any other folders or documents on your Drive."
        },
        {
            icon: Trash2,
            title: "Data Ownership & Deletion",
            content: "You maintain absolute ownership of your data. You can delete all local records, and permanently wipe all cloud-synced account records instantly from the Settings view using the 'Delete Account' and 'Clear All Data' buttons."
        },
        {
            icon: Lock,
            title: "Security & Encryption",
            content: "All network transmissions are fully encrypted via HTTPS. Firebase security rules are strictly configured to restrict access so that only you can read or write data associated with your authenticated account credentials."
        },
        {
            icon: Baby,
            title: "Children's Privacy",
            content: "Our app is safe for all ages. Because counting features can be fully utilized offline without registering an account, we do not knowingly collect personal details from children under 13."
        },
        {
            icon: FileText,
            title: "Changes to This Policy",
            content: "We may update this policy periodically to support new features. Any modifications are effective immediately upon posting here. We encourage you to review this page to stay informed of our practices."
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 12 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring" as const,
                stiffness: 120,
                damping: 14
            }
        }
    };

    return (
        <div className="h-dvh w-full flex flex-col overflow-hidden bg-background text-foreground selection:bg-primary/30 relative">
            {/* Background glowing overlays */}
            <div className="absolute top-0 left-1/4 w-[300px] h-[300px] bg-primary/5 rounded-full filter blur-[100px] pointer-events-none" />
            <div className="absolute bottom-10 right-1/4 w-[250px] h-[250px] bg-primary/3 rounded-full filter blur-[80px] pointer-events-none" />

            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-border/30 bg-background/70 backdrop-blur-xl shrink-0 pt-safe">
                <div className="container flex h-16 items-center px-6 max-w-2xl mx-auto">
                    <ArrowKeyBackButton className="mr-4 text-primary hover:text-primary/80 transition-colors" />
                    <h1 className="text-base font-semibold tracking-wide text-foreground">Privacy Policy</h1>
                </div>
            </header>

            {/* Scrollable Content Container */}
            <main className="flex-1 overflow-y-auto touch-pan-y scrollbar-none pb-safe">
                <div className="container max-w-2xl mx-auto px-6 py-10 space-y-10">
                    
                    {/* Hero Header Section */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                        className="text-center space-y-4"
                    >
                        <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto border border-primary/20 shadow-inner">
                            <Shield className="w-8 h-8 text-primary" />
                        </div>
                        <div className="space-y-1.5">
                            <h2 className="text-2xl font-bold tracking-tight">Your Privacy Matters</h2>
                            <p className="text-xs text-muted-foreground">Last Updated: July 2026</p>
                        </div>
                    </motion.div>

                    {/* Staggered Grid of Policy Cards */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid gap-5"
                    >
                        {sections.map((section, index) => (
                            <motion.section
                                key={index}
                                variants={itemVariants}
                                className="flex gap-4 p-5 rounded-[1.75rem] bg-card/30 border border-border/40 backdrop-blur-sm shadow-sm hover:border-primary/20 transition-all duration-300 group"
                            >
                                <div className="shrink-0 pt-0.5">
                                    <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-105 group-hover:bg-primary/15 transition-all duration-200">
                                        <section.icon className="w-5 h-5 text-primary" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors duration-200">
                                        {section.title}
                                    </h3>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        {section.content}
                                    </p>
                                </div>
                            </motion.section>
                        ))}
                    </motion.div>

                    {/* Footer Area */}
                    <footer className="pt-10 border-t border-border/20 text-center space-y-4 pb-12">
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Questions about our privacy practices?
                            <br />
                            Email us at <span className="text-primary font-medium hover:underline cursor-pointer">koorbobillin@gmail.com</span>
                        </p>
                        <ArrowKeyBackButton className="mx-auto mt-2" label="Back to App" />
                    </footer>
                </div>
            </main>
        </div>
    );
}
