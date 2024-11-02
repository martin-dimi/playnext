import "@/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Chakra_Petch } from "next/font/google";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Playnext",
  description: "Playnext description",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const chakra = Chakra_Petch({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-chakra",
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${chakra.variable} ${chakra.className}`}
    >
      <body className="flex min-w-screen bg-gradient-to-br from-[#1E1E1E] to-[#141414] text-white dark">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
