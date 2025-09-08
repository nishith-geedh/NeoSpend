import NextAuth from 'next-auth';
import CognitoProvider from 'next-auth/providers/cognito';

const handler = NextAuth({
  providers: [
    CognitoProvider({
      clientId: process.env.COGNITO_CLIENT_ID,
      clientSecret: process.env.COGNITO_CLIENT_SECRET,
      issuer: process.env.COGNITO_ISSUER,
      domain: 'neospend-925529666302-ap-south-1.auth.ap-south-1.amazoncognito.com',
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login',
    signOut: '/',
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        // Store only essential token info to reduce cookie size
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
      }
      return token;
    },
    async session({ session, token }) {
      // Pass the tokens to the session
      session.accessToken = token.accessToken;
      session.idToken = token.idToken;
      session.refreshToken = token.refreshToken;
      session.expiresAt = token.expiresAt;
      return session;
    },
    async redirect({ url, baseUrl }) {
      // If there's an error parameter, redirect to login page
      if (url.includes('error=')) {
        return baseUrl + '/login';
      }
      
      // After successful login, redirect to dashboard
      if (url === baseUrl || url === baseUrl + '/') {
        return baseUrl + '/dashboard';
      }
      
      // If URL is the callback URL, redirect to dashboard
      if (url.includes('/api/auth/callback/cognito')) {
        return baseUrl + '/dashboard';
      }
      
      // For logout, ensure we stay on the same domain
      if (url.includes('/api/auth/signout')) {
        return baseUrl;
      }
      
      return url;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60, // 30 days
      },
    },
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log('Sign in event:', { user: user.email, account: account?.provider });
    },
    async signOut({ token }) {
      console.log('Sign out event');
    },
    async error({ error }) {
      console.log('Auth error:', error);
    },
  },
  debug: process.env.NODE_ENV === 'development',
});

export { handler as GET, handler as POST };