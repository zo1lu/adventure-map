import type { Metadata } from "next";
import "./globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import { AuthProvider } from "./Providers";
config.autoAddCss = false;


export const metadata: Metadata = {
  title: "Adventure Map",
  description: "create travel diary and explore",
};

export default function RootLayout({children}: {children: React.ReactNode;}) {
  return (
    <html>
      <AuthProvider>
        <body>{children}</body>
      </AuthProvider>
    </html>
  );
}
