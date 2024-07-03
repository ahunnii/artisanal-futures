/* eslint-disable @typescript-eslint/require-await */
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { Role } from "@prisma/client";

import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";

import { env } from "~/env.mjs";
import { prisma } from "~/server/db";

const useSecureCookies = env.NEXTAUTH_URL.startsWith("https://");
const cookiePrefix = useSecureCookies ? "__Secure-" : "";
const hostName = new URL(env.NEXTAUTH_URL).hostname;

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;

      // ...other properties
      role: Role;
    };
  }

  interface User {
    // ...other properties
    role: Role;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
        role: user.role,
      },
    }),

    async signIn(props) {
      const { user } = props;

      // No account, tries to sign in
      const authUser = await prisma.user.findUnique({
        where: { id: user.id },
      });

      if (!authUser) {
        return "/sign-in?error=account-not-found";
      }

      // Account, but wrong provider

      // Account, successful

      return true;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
      // profile: (profile) => {
      //   return {
      //     ...profile,
      //     role: profile.role ?? "USER",
      //   };
      // },
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      // profile: (profile) => {
      //   return {
      //     ...profile,
      //     role: profile.role ?? "USER",
      //   };
      // },
    }),
    Auth0Provider({
      clientId: env.AUTH0_CLIENT_ID,
      clientSecret: env.AUTH0_CLIENT_SECRET,
      issuer: env.AUTH0_ISSUER,
      authorization: {
        params: {
          prompt: "login",
        },
      },
    }),

    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  pages: {
    signIn: "/sign-in",
    newUser: "/onboarding",
  },
  cookies: {
    sessionToken: {
      name: `${cookiePrefix}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        domain: "." + hostName,
        secure: useSecureCookies,
      },
    },
  },
};

export const authWithContext = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return {
    callbacks: {
      session: ({ session, user }) => ({
        ...session,
        user: {
          ...session.user,
          id: user.id,
          role: user.role,
        },
      }),

      async signIn(props) {
        const { user } = props;

        const authUser = await prisma.user.findUnique({
          where: { id: user.id },
        });

        // No account, tries to sign in
        if (!authUser) {
          // Check if the user is authed with the pass code
          const isNewUserAuthed = ctx.req.cookies.code;

          if (process.env.NEXT_PUBLIC_PASSWORD_PROTECT === isNewUserAuthed)
            return true;

          // Otherwise, restrict access
          return "/sign-in?error=account-not-found";
        }

        // Account, but wrong provider

        // Account, successful

        return true;
      },
      async redirect({ url, baseUrl }) {
        // Allows relative callback URLs
        if (url.startsWith("/")) return `${baseUrl}${url}`;
        // Allows callback URLs on the same origin
        else if (new URL(url).origin === baseUrl) return url;
        return baseUrl;
      },
    },
    adapter: PrismaAdapter(prisma),
    providers: [
      DiscordProvider({
        clientId: env.DISCORD_CLIENT_ID,
        clientSecret: env.DISCORD_CLIENT_SECRET,
        // profile: (profile) => {
        //   return {
        //     ...profile,
        //     role: profile.role ?? "USER",
        //   };
        // },
      }),
      GoogleProvider({
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        // profile: (profile) => {
        //   return {
        //     ...profile,
        //     role: profile.role ?? "USER",
        //   };
        // },
      }),
      Auth0Provider({
        clientId: env.AUTH0_CLIENT_ID,
        clientSecret: env.AUTH0_CLIENT_SECRET,
        issuer: env.AUTH0_ISSUER,
        authorization: {
          params: {
            prompt: "login",
          },
        },
      }),

      /**
       * ...add more providers here.
       *
       * Most other providers require a bit more work than the Discord provider. For example, the
       * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
       * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
       *
       * @see https://next-auth.js.org/providers/github
       */
    ],
    pages: {
      signIn: "/sign-in",
      newUser: "/onboarding",
    },
    cookies: {
      sessionToken: {
        name: `${cookiePrefix}next-auth.session-token`,
        options: {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          domain: "." + hostName,
          secure: useSecureCookies,
        },
      },
    },
  } as NextAuthOptions;
};
/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
