import Cookies from "js-cookie";
import create, { SetState, GetState } from "zustand";
import { verifyToken } from "../Auth/jwt";
import { UserInterface } from "../Constants/Types";

type IAuth = {
  user: UserInterface | null;
  setUser: (user: any) => void;
  isEditEnable: boolean;
  toogleEdit: () => void;
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  refreshToken: string | null;
  setRefreshToken: (token: string | null) => void;
};

const authStore = (set: SetState<IAuth>, get: GetState<IAuth>): IAuth => ({
  isEditEnable: false,
  toogleEdit: () => {
    set(({ isEditEnable }) => {
      const { isAdmin } = get().user || {};
      if (isAdmin) {
        isEditEnable = !isEditEnable;
      } else {
        isEditEnable = false;
      }
      return { isEditEnable: isEditEnable };
    });
  },
  user: null,
  setUser: (value) => set(() => ({ user: value })),
  accessToken: null,
  setAccessToken: (token) => {
    if (token == null) {
      localStorage.removeItem("access-token");
    } else {
      localStorage.setItem("access-token", token);
      const { result, error } = verifyToken(token) as any;
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
