import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';

import { AuthOptions } from 'next-auth';
import { sendRequest } from '@/ultils/api';
import { JWT } from 'next-auth/jwt';

export const authOptions: AuthOptions = {
   // Configure one or more authentication providers
   theme: {
      colorScheme: 'light',
   },
   secret: process.env.NO_SECRET,
   providers: [
      CredentialsProvider({
         // The name to display on the sign in form (e.g. "Sign in with...")
         name: 'Credentials',
         credentials: {
            username: { label: 'Username', type: 'text' },
            password: { label: 'Password', type: 'password' },
         },

         async authorize(credentials, req) {
            const res = await sendRequest<IBackendRes<JWT>>({
               url: 'http://localhost:8000/api/v1/auth/login',
               method: 'POST',
               body: {
                  username: credentials?.username,
                  password: credentials?.password,
               },
            });
            if (res && res.data) {
               return res.data as any;
            } else {
               throw new Error(res?.message as string);
            }
         },
      }),

      GithubProvider({
         clientId: process.env.GITHUB_ID!,
         clientSecret: process.env.GITHUB_SECRET!,
         style: {
            logo: '/github.svg',
            logoDark: '/github-dark.svg',
            bg: '#fff',
            bgDark: '#fff',
            text: 'red',
            textDark: '#000',
         },
      }),
      // ...add more providers here
   ],
   callbacks: {
      async jwt({ token, trigger, account, user }) {
         if (trigger === 'signIn' && account?.provider !== 'credentials') {
            const res = await sendRequest<IBackendRes<JWT>>({
               url: 'http://localhost:8000/api/v1/auth/social-media',
               method: 'POST',
               body: {
                  type: account?.provider?.toLocaleUpperCase(),
                  username: user.email,
               },
            });
            if (res.data) {
               token.access_token = res.data?.access_token;
               token.refresh_token = res.data.refresh_token;
               token.user = res.data.user;
            }
         }
         if (trigger === 'signIn' && account?.provider === 'credentials') {
            //@ts-ignore
            token.access_token = user.access_token;
            //@ts-ignore
            token.refresh_token = user.refresh_token;
            //@ts-ignore
            token.user = user.user;
         }
         return token;
      },
      session({ session, token, user }) {
         if (token) {
            session.access_token = token.access_token;
            session.refresh_token = token.refresh_token;
            session.user._id = token.user._id;
            session.user.name = token.user.name;
            session.user.username = token.user.username;
            session.user.email = token.user.email;
            session.user.address = token.user.address;
            session.user.isVerify = token.user.isVerify;
            session.user.role = token.user.role;
            session.user.type = token.user.type;
         }
         return session;
      },
   },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
