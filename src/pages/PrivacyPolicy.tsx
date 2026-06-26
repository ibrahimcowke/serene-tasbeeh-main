import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Lock, Eye, Database, Globe, Baby, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PrivacyPolicy() {
    const navigate = useNavigate();

    const sections = [
        {
            icon: Shield,
            title: "Our Commitment",
            content: "Tasbeehly is designed with a 'privacy-first' philosophy. We believe your spiritual practice is personal. This policy complies with Google Play Store standards and explains how we treat your information."
        },
        {
            icon: Database,
            title: "Data Collection & Google Drive",
            content: "We collect only data necessary for app functionality: your counts, streaks, and custom dhikrs. By default, this data remains exclusively on your local device. If you choose to enable Google Drive Sync, a backup file named 'tasbeehly_backup.json' is created inside your personal Google Drive. We do not collect or request Personally Identifiable Information (PII) such as names, emails, or phone numbers."
        },
        {
            icon: Lock,
            title: "How Data is Protected",
            content: "All data is stored locally on your device. When using Google Drive Sync, data is transmitted directly from your device to Google's secure servers via HTTPS encryption. Because there is no centralized app database, your records cannot be accessed, shared, or breached globally."
        },
        {
            icon: Eye,
            title: "Third-Party Services",
            content: "We only connect to Google Drive REST API (v3) to facilitate backup and restore. Authorizing Google Drive only grants the app permission to access the files it creates itself ('drive.file' scope). It cannot access any other files, folders, or details in your Google Drive."
        },
        {
            icon: Globe,
            title: "Log Data, Cookies & PWA",
            content: "As a Progressive Web App, we use local storage and service workers to ensure offline functionality. We do not collect Log Data, track user behavior, or use tracking cookies across websites."
        },
        {
            icon: Baby,
            title: "Children's Privacy",
            content: "Our services are safe for all ages. Since we do not collect any personal data, we do not knowingly collect personal information from children under 13."
        },
        {
            icon: FileText,
            title: "Changes to This Policy",
            content: "We may update our Privacy Policy periodically. We advise you to review this page for changes. Any updates will be effective immediately upon posting to this page."
        }
    ];

    return (
        <div className="min-h-dvh bg-background text-foreground selection:bg-primary/30">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
                <div className="container flex h-16 items-center px-4 max-w-2xl mx-auto">
                    <motion.button
                        whileHover={{ scale: 1.05, x: -3 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/")}
                        className="mr-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer backdrop-blur-md"
                        style={{
                            background: "rgba(255,255,255,0.05)",
                            borderColor: "hsl(var(--primary) / 0.25)",
                            boxShadow: "0 2px 10px rgba(0,0,0,0.15), inset 0 1px 1px rgba(255,255,255,0.05)",
                            color: "hsl(var(--primary))",
                        }}
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Dashboard</span>
                    </motion.button>
                    <h1 className="text-lg font-medium">Privacy Policy</h1>
                </div>
            </header>

            <main className="container max-w-2xl mx-auto px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-12"
                >
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                            <Shield className="w-8 h-8 text-primary" />
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight">Your Privacy Matters</h2>
                        <p className="text-muted-foreground italic">Last Updated: June 2026</p>
                    </div>

                    <div className="grid gap-8">
                        {sections.map((section, index) => (
                            <motion.section
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex gap-4 p-6 rounded-3xl bg-card border border-border/50 shadow-sm"
                            >
                                <div className="shrink-0">
                                    <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center">
                                        <section.icon className="w-5 h-5 text-primary" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-lg">{section.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {section.content}
                                    </p>
                                </div>
                            </motion.section>
                        ))}
                    </div>

                    <footer className="pt-12 border-t text-center space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Questions about our privacy practices?
                            <br />
                            Email us at <span className="text-primary font-medium">privacy@tasbeehly.com</span>
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            className="px-8 py-3 bg-primary text-primary-foreground rounded-2xl font-medium hover:opacity-90 transition-opacity"
                        >
                            Back to App
                        </button>
                    </footer>
                </motion.div>
            </main>
        </div>
    );
}
