import type { Metadata } from "next";
import { Inter, Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { headers } from "next/headers";
import { getTenantFromHost } from "@/lib/tenant";
import { CartProvider } from "@/contexts/CartContext";
import { CartDrawer } from "@/components/CartDrawer";
import { SocialFloatingButtons } from "@/components/SocialFloatingButtons";
import { Providers } from "@/components/Providers";
import { RemarketingScripts } from "@/components/RemarketingScripts";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });

export const metadata: Metadata = {
  title: "Colaps Store",
  description: "Tienda online con envío gratis y pago contraentrega.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const host = headers().get("host") || "localhost";
  const tenant = getTenantFromHost(host);

  return (
    <html lang="es" className={`${inter.variable} ${outfit.variable} ${jakarta.variable}`}>
      <body>
        <Providers>
          <CartProvider>
            <Navbar storeName={tenant.name} />
            <main>{children}</main>
            <Footer storeName={tenant.name} />
            <CartDrawer />
            <SocialFloatingButtons 
              whatsappNumber="573222844958"
              instagramUser="colapstech"
              messengerUser="colapstech"
            />
          </CartProvider>
        </Providers>
        <RemarketingScripts />
      </body>
    </html>
  );
}