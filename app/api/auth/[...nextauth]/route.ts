// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
// Note: In NextAuth v4 App Router, you use next-auth for types, but next-auth/next for the handler.
import NextAuthHandler from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma"; // Asumiendo que usás Prisma

export const authOptions: NextAuthOptions = {
  // Adapter para base de datos (Prisma recomendado)
  adapter: PrismaAdapter(prisma),

  providers: [
    // Google OAuth (para login social)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true, // Permite vincular cuentas con mismo email
    }),

    // Email/Password tradicional
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email y contraseña requeridos");
        }

        // Buscar usuario en DB
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.hashedPassword) {
          throw new Error("Credenciales inválidas");
        }

        // Verificar contraseña (usando bcrypt)
        const bcrypt = require('bcryptjs');
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isPasswordValid) {
          throw new Error("Credenciales inválidas");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      }
    }),
  ],

  // Páginas personalizadas
  pages: {
    signIn: '/auth/signin',      // Página de login custom
    signOut: '/auth/signout',    // Página de logout
    error: '/auth/error',        // Página de error
    newUser: '/bienvenido',      // Redirect después de registro
  },

  // Session strategy
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },

  // Callbacks importantes
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      // Al hacer login
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }

      // Al actualizar sesión
      if (trigger === "update" && session) {
        token = { ...token, ...session };
      }

      return token;
    },
    
    async session({ session, token }) {
      // Pasar datos del token a la sesión
      if (session.user) {
        (session.user as any).id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    },

    // Redirect después de login
    async redirect({ url, baseUrl }) {
      // Si viene de checkout, volver al checkout
      if (url.includes('/checkout')) {
        return url;
      }
      // Si viene de producto, volver al producto
      if (url.startsWith(baseUrl)) {
        return url;
      }
      // Default: ir a cuenta
      return `${baseUrl}/cuenta`;
    },
  },

  // Eventos para tracking/remarketing
  events: {
    async signIn({ user, account, profile }) {
      // Track login en Google Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'login', {
          method: account?.provider,
          user_id: user.id,
        });
      }

      // Track en Meta Pixel
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'CompleteRegistration', {
          value: 0,
          currency: 'COP',
        });
      }
    },
  },

  // Debug en desarrollo
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuthHandler(authOptions);
export { handler as GET, handler as POST };
