import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    phoneNumber?: string | null; // Add your custom property here
  }

  interface Session {
    user: {
      id: string;
      phoneNumber?: string | null;
      name?: string | null;
      image?: string | null;
    };
  }

  interface JWT {
    id: string;
    phoneNumber?: string | null;
  }
}

