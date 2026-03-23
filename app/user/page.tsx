import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatPrice } from "@/lib/queries";
import { themes } from "@/lib/themes";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ProfileInfoClient } from "@/components/ProfileInfoClient";

export default async function UserPage() {
  const session = await getServerSession(authOptions);
  const theme = themes.tecnologia;

  if (!session || !session.user) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        include: { items: true },
      },
    },
  });

  if (!user) {
    redirect("/");
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] pb-20 transition-colors duration-500">
        <div className="max-w-6xl mx-auto px-6 pt-12">
          {/* Header Section */}
          <header className="mb-12">
            <div className="flex items-center gap-6 mb-8">
              <div 
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-orange-500/20"
                style={{ background: "linear-gradient(135deg, #ff3b30, #ff6b00)" }}
              >
                {user.name?.[0] || user.email?.[0].toUpperCase()}
              </div>
              <div>
                <h1 className="text-4xl font-black tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                  ¡Hola, {user.name?.split(" ")[0]}!
                </h1>
                <p className="text-[var(--color-text-muted)] mt-1 font-medium">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-text)]/5 backdrop-blur-sm">
                <h3 className="text-xs uppercase tracking-widest font-bold text-[var(--color-text-muted)] mb-2">Pedidos Realizados</h3>
                <p className="text-3xl font-black">{user.orders.length}</p>
              </div>
              <div className="p-6 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-text)]/5 backdrop-blur-sm">
                <h3 className="text-xs uppercase tracking-widest font-bold text-[var(--color-text-muted)] mb-2">Miembro desde</h3>
                <p className="text-xl font-bold">
                  {new Date(user.createdAt).toLocaleDateString("es-CO", { month: "long", year: "numeric" })}
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-text)]/5 backdrop-blur-sm">
                <h3 className="text-xs uppercase tracking-widest font-bold text-[var(--color-text-muted)] mb-2">Ciudad Principal</h3>
                <p className="text-xl font-bold">{user.city || "No definida"}</p>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content: Orders */}
            <div className="lg:col-span-2 space-y-8">
              <h2 className="text-2xl font-black mb-6">Mis Pedidos</h2>
              
              {user.orders.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-[var(--color-bg-secondary)] border border-dashed border-[var(--color-text)]/10">
                  <p className="text-[var(--color-text-muted)] mb-6 font-medium">Aún no has realizado ningún pedido.</p>
                  <Link 
                    href="/#productos" 
                    className="inline-block px-8 py-4 rounded-xl bg-gradient-to-r from-[#ff3b30] to-[#ff6b00] text-white font-bold hover:scale-105 transition-transform shadow-lg shadow-orange-500/20"
                  >
                    Ir de compras
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {user.orders.map((order) => (
                    <div 
                      key={order.id} 
                      className="group p-6 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-text)]/5 hover:border-[var(--color-accent)]/30 transition-all cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase mb-1 tracking-wider">Pedido #{order.orderNumber}</p>
                          <p className="text-sm font-medium opacity-60">
                            {new Date(order.createdAt).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          order.status === "DELIVERED" ? "bg-green-500/20 text-green-400" :
                          order.status === "PENDING" ? "bg-yellow-500/20 text-yellow-400" :
                          "bg-[var(--color-text)]/10 text-[var(--color-text)]"
                        }`}>
                          {order.status}
                        </span>
                      </div>

                      <div className="flex items-end justify-between">
                        <div className="flex -space-x-2">
                          <div className="w-10 h-10 rounded-lg bg-[var(--color-bg)] border border-[var(--color-text)]/10 flex items-center justify-center text-xs shadow-sm">
                            {order.items.length} 📦
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-[var(--color-text-muted)] font-bold mb-1 uppercase tracking-tighter">Total</p>
                          <p className="text-xl font-black">{formatPrice(order.total.toString(), "COP")}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar: Details (Client-side) */}
            <ProfileInfoClient user={{
              name: user.name,
              phone: user.phone,
              address: user.address,
              city: user.city
            }} />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
