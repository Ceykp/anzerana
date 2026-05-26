import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  trustHost: true,

  session: {
    strategy: "jwt",
  },

  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],

  pages: {
    signIn: "/giris-yap",
  },

  callbacks: {
    async jwt({ token }) {
      const adminEmail = "yakuphanmollahamzaoglu@gmail.com";
      const tokenEmail = token.email?.trim().toLowerCase();

      token.role = tokenEmail === adminEmail ? "admin" : "customer";

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.name = session.user.name ?? token.name;
        session.user.email = session.user.email ?? token.email;
        session.user.image = session.user.image ?? (token.picture as string);
        session.user.role = token.role as "admin" | "customer";
      }

      return session;
    },
  },
});