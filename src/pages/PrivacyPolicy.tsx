import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Lock, Eye, Database, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PrivacyPolicy() {
    const navigate = useNavigate();

    const sections = [
        {
            icon: Shield,
            title: "Our Commitment",
            content: "Tasbeeh is designed with a 'privacy-first' philosophy. We believe your spiritual practice is personal, and your data should remain so. This policy explains how we treat your information with the respect it deserves."
        },
        {
            icon: Database,
            title: "Data We Collect",
            content: "We collect minimal data necessary for the app's functionality: your counts, streaks, and custom dhikrs. If you choose to use our Cloud Sync feature, this data is securely stored in our encrypted database associated with your authenticated account."
        },
        {
            icon: Lock,
            title: "How Data is Protected",
            content: "All cloud-synced data is encrypted in transit and at rest using industry-standard protocols. For users who do not use Cloud Sync, all data remains exclusively on your local device storage and never touches our servers."
        },
        {
            icon: Eye,
            title: "No Third-Party Sharing",
            content: "We do not sell, trade, or share your personal data with any third parties, advertisers, or analytics companies. Your dhikr history is for your eyes only."
        },
        {
            icon: Globe,
            title: "Cookies & PWA",
            content: "As a Progressive Web App, we use local storage and service workers to ensure the app works offline. These are functional tools and are not used for tracking your behavior across other websites."
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
                            Email us at <span className="text-primary font-medium">privacy@serene-tasbeeh.com</span>
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
