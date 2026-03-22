import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { headers } from "next/headers";
import { getTenantFromHost } from "@/lib/tenant";
import { CartProvider } from "@/contexts/CartContext";
import { CartDrawer } from "@/components/CartDrawer";
import { WhatsAppFloatingButton } from "@/components/WhatsAppFloatingButton";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Colaps Store",
  description: "Tienda online con envío gratis y pago contraentrega.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const host = headers().get("host") || "localhost";
  const tenant = getTenantFromHost(host);

  return (
    <html lang="es" className={inter.variable}>
      <body>
        <CartProvider>
          <Navbar storeName={tenant.name} />
          <main>{children}</main>
          <Footer storeName={tenant.name} />
          <CartDrawer />
          <WhatsAppFloatingButton 
            phoneNumber="573222844958"
          />
        </CartProvider>
      </body>
    </html>
  );
}