import {
  CredentialsSignin,
  type DefaultSession,
  type NextAuthConfig,
} from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/database";
import { accounts, sessions, users } from "@/database/schema";
import Credentials from "next-auth/providers/credentials";
import { compareSync } from "bcryptjs";
import { eq } from "drizzle-orm";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

export const authConfig = {
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
  }),
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          const user = await db.query.users.findFirst({
            where: eq(users.email, credentials.email as string),
          });

          if (!user) {
            throw new CredentialsSignin("User not registered.", {
              name: "UserNotFoundError",
            });
          }

          const isValidPassword = compareSync(
            credentials.password as string,
            user.password
          );

          if (!isValidPassword) {
            throw new CredentialsSignin("Invalid Password", {
              name: "PasswordError",
            });
          }

          return {
            id: user.id,
            email: user.email,
            emailVerified: user.emailVerified,
            name: user.name,
            image: user.image,
          };
        } catch (error: any) {
          throw new CredentialsSignin("Internal Server Error", {
            name: "ServerError",
          });
        }
      },
    }),
  ],
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
  session: {
    strategy: "database",
  },
} satisfies NextAuthConfig;

