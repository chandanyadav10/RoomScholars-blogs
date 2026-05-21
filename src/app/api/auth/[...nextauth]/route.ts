import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Demo credentials — replace with DB lookup in production
        const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@roomscholars.com";
        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

        if (
          credentials?.email === ADMIN_EMAIL &&
          credentials?.password === ADMIN_PASSWORD
        ) {
          return {
            id: "1",
            name: "RoomScholars Admin",
            email: ADMIN_EMAIL,
            role: "admin",
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as { role?: string }).role;
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET || "roomscholars-dev-secret-change-in-prod",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
