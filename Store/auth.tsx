import Cookies from "js-cookie";
import create, { SetState } from "zustand";
import { verifyToken } from "../Auth/jwt";

type IAuth = {
  user: any;
  setUser: (value: any) => void;
  accessToken: string | null;
  setAccessToken: (value: string) => void;
  refreshToken: string | null;
  setRefreshToken: (value: string) => void;
};

const authStore = (set: SetState<IAuth>): IAuth => ({
  user: null,
  setUser: (value) => set(() => ({ user: value })),
  accessToken: null,
  setAccessToken: (token) => {
    if (token == null) {
      localStorage.removeItem("access-token");
    } else {
      localStorage.setItem("access-token", token);
      const { result, error } = verifyToken(token);
      if (!error && result?.exp) {
        Cookies.set("token", token, {
          expires: new Date(result.exp * 1000),
        });
      }
    }
    set(() => ({ accessToken: token }));
  },
  refreshToken: null,
  setRefreshToken: (token) => {
    if (token == null) {
      localStorage.removeItem("refresh-token");
    } else {
      localStorage.setItem("refresh-token", token);
    }
    set(() => ({ refreshToken: token }));
  },
});

export const useAuthStore = create<IAuth>(authStore);
