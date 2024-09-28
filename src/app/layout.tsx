import "play/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "play/trpc/react";

export const metadata: Metadata = {
  title: "Playnext",
  description: "Playnext description",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <h1 className="absolute right-10 top-10 text-white">
          This is the default background!
        </h1>

        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
