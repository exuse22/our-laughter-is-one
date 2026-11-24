import type { Metadata } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond, Playfair_Display } from "next/font/google";
import "./globals.css";
import CustomerAssistant from "./components/CustomerAssistant";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "OUR LAUGHTER IS ONE | Official Bookstore",
  description:
    "Read, smile and be united. Discover OUR LAUGHTER IS ONE.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
    className={geistSans.variable + " " + geistMono.variable + " " + cormorant.variable + " " + playfair.variable + " h-full antialiased"}
    >
    <body suppressHydrationWarning className="min-h-full flex flex-col">
  {children}
  <CustomerAssistant />
</body>
    </html>
  );
}