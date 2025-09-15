import "./globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Poppins } from "next/font/google";
import Providers from "./provider";
import { Toaster } from "@/components/ui/sonner";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "Console4Everyone",
  description: "Renting PS5 Consoles Made Easy",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.className} dark`}>
      <body className="min-h-screen bg-black text-white">
        {/* Navigation */}
        <Providers>
          <Header />

          <main className="bg-black">{children}</main>
          <Toaster position="top-right" richColors theme="dark" />
          {/* Footer */}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
