import NextAuth from 'next-auth';
import { DefaultSession, DefaultJWT } from 'next-auth';
import { JWT } from 'next-auth/jwt';

interface IUser {
   _id: string;
   name: string;
   username: string;
   email: string;
   address: string;
   isVerify: boolean;
   type: string;
   role: string;
}

declare module 'next-auth/jwt' {
   interface JWT {
      access_token: string;
      refresh_token: string;
      user: IUser;
   }
}

declare module 'next-auth' {
   interface Session {
      access_token: string;
      refresh_token: string;
      user: IUser;
      //   user: {
      //      address: string;
      //   } & DefaultSession['user'];
   }
}

interface IAuthUser {
   access_token: string;
   refresh_token: string;
   user: IUser;
}
