import Link from "next/link"
import { CheckCircle, Users, DollarSign, BarChart3, Shield } from "lucide-react"
import Head from "next/head"

export default function LandingPage() {
  return (
    <>
        <Head>
            {/* Basic Meta Tags */}
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Open Leads – Real Estate Lead Tracking for Agents</title>
            <meta name="description" content="Open Leads helps real estate agents manage, track, and convert leads effectively. Simplify your sales pipeline with our intuitive platform." />
            <meta 
            name="keywords" 
            content="
                lead, 
                leads, 
                open lead, 
                open leads, 
                openlead, 
                openleads, 
                lead management, 
                leads management, 
                lead manager, 
                leads manager, 
                agent management, 
                agents management, 
                real estate leads, 
                lead tracker, 
                leads tracker, 
                agent tracker, 
                agents tracker, 
                agent help website, 
                agents help website, 
                agent CRM, 
                agents CRM, 
                property sales management, 
                open leads, 
                real estate,
                real estate lead,
                real estate leads management,
                software, 
                lead management software, 
                lead managing software, 
                customer management, 
                customer tracking"
            />
            <meta name="author" content="Open Leads Team" />

            {/* Canonical Link */}
            <link rel="canonical" href="https://www.openleads.in/" />

            {/* Open Graph Tags for Social Sharing */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content="Open Leads : Real Estate Lead Tracking" />
            <meta property="og:description" content="Manage and convert property leads like a pro with Open Leads." />
            <meta property="og:url" content="https://www.openleads.in/" />
            <meta property="og:image" content="https://www.openleads.in/favicon.ico" />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="Open Leads : Real Estate Lead Tracker" />
            <meta name="twitter:description" content="Boost your sales efficiency with Open Leads. Track, manage, and close leads faster." />
            <meta name="twitter:image" content="https://www.openleads.in/favicon.ico" />

            {/* Structured Data (JSON-LD) */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{
            __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "Open Leads",
                "url": "https://www.openleads.in",
                "description": "Open Leads is a real estate lead tracking platform for agents and sales professionals.",
                "publisher": {
                "@type": "Organization",
                "name": "Open Leads"
                }
            })
            }} />
        </Head>
    
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <main className="max-w-7xl mx-auto flex-1 flex flex-col items-center justify-center text-center py-12 sm:py-20">
            {/* Hero Section */}
            <section className="mb-16 sm:mb-24">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6 animate-fade-in-up">
                Empower Your Referral Network, <br className="hidden md:inline" />
                Maximize Your Leads
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-10 animate-fade-in-up delay-100">
                Open Leads provides a comprehensive platform for real estate agents to manage referrals, track leads, and
                boost conversions with powerful analytics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-200">
                <Link
                href="/signup"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                <Users size={20} />
                Get Started Free
                </Link>
                <Link
                href="/login"
                className="px-8 py-4 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-blue-600 dark:text-blue-300 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                <Shield size={20} />
                Sign In
                </Link>
            </div>
            </section>

            {/* Features Section */}
            <section className="w-full max-w-6xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-12">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 flex flex-col items-center text-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
                    <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Agent Management</h3>
                <p className="text-slate-600 dark:text-slate-300">
                    Effortlessly add and manage your network of referral agents.
                </p>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 flex flex-col items-center text-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                <div className="p-4 bg-green-100 dark:bg-green-900 rounded-full mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Lead Tracking & Conversion</h3>
                <p className="text-slate-600 dark:text-slate-300">
                    Track leads from active to converted or rejected, with detailed history.
                </p>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 flex flex-col items-center text-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                <div className="p-4 bg-yellow-100 dark:bg-yellow-900 rounded-full mb-4">
                    <DollarSign className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Revenue Insights</h3>
                <p className="text-slate-600 dark:text-slate-300">
                    Monitor total and monthly revenue, and track plan-wise earnings.
                </p>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 flex flex-col items-center text-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                <div className="p-4 bg-purple-100 dark:bg-purple-900 rounded-full mb-4">
                    <BarChart3 className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Performance Analytics</h3>
                <p className="text-slate-600 dark:text-slate-300">
                    Gain insights into agent performance and lead status distribution.
                </p>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 flex flex-col items-center text-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                <div className="p-4 bg-red-100 dark:bg-red-900 rounded-full mb-4">
                    <Shield className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Secure & Reliable</h3>
                <p className="text-slate-600 dark:text-slate-300">
                    Your data is secure with robust authentication and payment confirmation.
                </p>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 flex flex-col items-center text-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                <div className="p-4 bg-orange-100 dark:bg-orange-900 rounded-full mb-4">
                    <DollarSign className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Flexible Plans</h3>
                <p className="text-slate-600 dark:text-slate-300">
                    Choose from various subscription plans tailored to your business needs.
                </p>
                </div>
            </div>
            </section>
        </main>

        {/* Footer */}
        <footer className="w-full py-8 text-center text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 mt-16">
            <p>&copy; {new Date().getFullYear()} Open Leads. All rights reserved.</p>
        </footer>
        </div>
    </>
  )
}
