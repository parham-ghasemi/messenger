'use client'

import { SessionProvider, useSession } from "next-auth/react";
import startPusherBeams from "../libs/pusher-beams";
import { useEffect } from "react";

interface AuthContextProps {
    children: React.ReactNode;
}

function AuthContextProvider({ children }: AuthContextProps) {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.id) {
      startPusherBeams(session.user.id);
    }
  }, [session]);

  return <>{children}</>;
}

export default function AuthContext({ children }: AuthContextProps) {
  return (
    <SessionProvider>
      <AuthContextProvider>{children}</AuthContextProvider>
    </SessionProvider>
  );
}