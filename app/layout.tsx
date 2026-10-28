import type { Metadata } from "next";
import { Inter, Open_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bolar.lat"),
  applicationName: "BOLAR",
  title: { default: "BOLAR | Remesas internacionales", template: "%s | BOLAR" },
  description: "Envía dinero. Ahorra tiempo y gasta menos. Conoce Bolar y explora nuestro simulador de remesas de Brasil a Bolivia.",
  openGraph: {
    type: "website",
    siteName: "BOLAR",
    locale: "es_BO",
    title: "BOLAR | Remesas internacionales",
    description: "Brasil y Bolivia, un poco más cerca. Conoce BOLAR.",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${openSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
