import './globals.css';
import { Roboto, Poppins } from "next/font/google"
import Providers from './providers';
import Script from "next/script";
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'Lead Tracker',
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
    <html lang="en">
      <head>
        {/* Google Identity Services script */}
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="beforeInteractive"
        />
      </head>
      <body className={`${roboto.variable} ${poppins.variable}`}>
        <Providers>
        <Toaster />
        {children}
        </Providers>
      </body>
    </html>
  )
}
