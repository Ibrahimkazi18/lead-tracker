import './globals.css';
import { Roboto, Poppins } from "next/font/google"
import Providers from './providers';
import Script from "next/script";
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from 'next-themes';
import Head from 'next/head';

export const metadata = {
  title: 'Open Leads',
  description: 'An application to track real-estate leads for agents.',
}

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-roboto",
})

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
})


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${roboto.variable} ${poppins.variable} transition-colors duration-500`}>
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

        {/* Google Identity Services */}
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="beforeInteractive"
        />
      </Head>

      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Providers>
          <Toaster />
            {children}
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
