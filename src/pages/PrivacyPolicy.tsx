import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Lock, Eye, Database, Globe, Baby, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PrivacyPolicy() {
    const navigate = useNavigate();

    const sections = [
        {
            icon: Shield,
            title: "Our Commitment",
            content: "tasbeehdikr is designed with a 'privacy-first' philosophy. We believe your spiritual practice is personal. This policy complies with Google Play Store standards and explains how we treat your information."
        },
        {
            icon: Database,
            title: "Data Collection and Use",
            content: "We collect only data necessary for app functionality: your counts, streaks, and custom dhikrs. This data remains exclusively on your local device. We do not collect or request Personally Identifiable Information (PII) such as names, emails, or phone numbers."
        },
        {
            icon: Lock,
            title: "How Data is Protected",
            content: "All data is stored locally on your device using standardized web storage mechanisms. We do not use cloud synchronization or remote servers, ensuring your data cannot be intercepted or breached remotely."
        },
        {
            icon: Eye,
            title: "Third-Party Services",
            content: "We do not sell, trade, or share data with advertisers, analytics companies, or third parties. The app operates completely offline without external tracking SDKs."
        },
        {
            icon: Globe,
            title: "Log Data, Cookies & PWA",
            content: "As a Progressive Web App, we use local storage and service workers to ensure offline functionality. We do not collect Log Data or use tracking cookies across websites."
        },
        {
            icon: Baby,
            title: "Children's Privacy",
            content: "Our services are safe for all ages, but do not explicitly target anyone under 13. Since we do not collect any personal data, we therefore do not knowingly collect personal information from children under 13."
        },
        {
            icon: FileText,
            title: "Changes to This Policy",
            content: "We may update our Privacy Policy periodically. We advise you to review this page for changes. Any updates will be effective immediately upon posting to this page."
        }
    ];

    return (
        <div className="min-h-screen min-h-dvh bg-background text-foreground selection:bg-primary/30">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
                <div className="container flex h-16 items-center px-4 max-w-2xl mx-auto">
                    <button
                        onClick={() => navigate(-1)}
                        className="mr-4 p-2 rounded-full hover:bg-secondary transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
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
                        <p className="text-muted-foreground italic">Last Updated: January 2026</p>
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
                            Email us at <span className="text-primary font-medium">privacy@tasbeehdikr.com</span>
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
