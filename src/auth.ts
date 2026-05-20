import NextAuth, { type DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";

declare module "next-auth" {
    interface Session {
        user: { id: string } & DefaultSession["user"];
    }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [Google],
    pages: { signIn: "/login" },
    callbacks: {
        session({ session, token }) {
            session.user.id = token.sub!;
            return session;
        },
    },
});
