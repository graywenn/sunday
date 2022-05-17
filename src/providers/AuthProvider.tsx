import { signin, getAuthUrl, signout } from "@apis/auth";
import useAsyncEffect from "@hooks/useAsyncEffect";
import { useAccount } from "@utils/utils";
import React, { createContext, useState } from "react";

interface IAuthContext {
  isAuthenticated: boolean;
  userName: string;
  userId: string;
  roles: any[];
  doAuthRedirect: () => Promise<void>;
  extractToken: () => Promise<void>;
  logout: () => Promise<void>;
}

export let AuthContext: React.Context<IAuthContext>;
export const AuthProvider: React.FC = ({ children }) => {
  const account = useAccount();
  const initialState = {
    isAuthenticated: true, //account.checkWhetherExpire(),
    userName: account?.username,
    userId: account?.id,
    roles: account?.roles,
  };

  const [auth, setAuth] = useState({
    ...initialState,
    doAuthRedirect: doAuthRedirect,
    extractToken: extractToken,
    logout: logout,
  });

  AuthContext = createContext(auth);

  useAsyncEffect(async () => {
    const expire = account.checkWhetherExpire();
    if (!expire) {
      const code = new URLSearchParams(location.search).get("code");
      if (code) {
        await extractToken();
      } else {
        await doAuthRedirect();
      }
    }
  }, []);

  async function extractToken() {
    const _urlParams = new URLSearchParams(location.search);
    const session_state = _urlParams.get("session_state");
    const code = _urlParams.get("code");

    const _account = await signin({ code, session_state });

    account.set(_account);
    location.assign(location.origin);
  }

  async function doAuthRedirect() {
    const url = await getAuthUrl();
    window.location.assign(url);
  }

  async function logout() {
    account.remove();
    const url = await signout();
    location.assign(url);
  }

  return (
    <>
      <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
    </>
  );
};