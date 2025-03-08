import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { compareSync } from "bcryptjs";
import { eq } from "drizzle-orm";
import {
  CredentialsSignin,
  type DefaultSession,
  type NextAuthConfig,
} from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { db } from "@/database";
import { accounts, users } from "@/database/schema";

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

const adapter = DrizzleAdapter(db, {
  usersTable: users,
  accountsTable: accounts,
});

export const authConfig = {
  adapter,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const user = await db.query.users.findFirst({
          where: eq(users.email, credentials.email as string),
        });

        if (!user) {
          throw new CredentialsSignin("UserNotFoundError");
        }

        const isValidPassword = compareSync(
          credentials.password as string,
          user.password
        );

        if (!isValidPassword) {
          throw new CredentialsSignin("PasswordError");
        }

        return {
          id: user.id,
          email: user.email,
          emailVerified: user.emailVerified,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id as string;
      }

      return token;
    },
    session: async ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.id as string,
      },
    }),
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },
} satisfies NextAuthConfig;
