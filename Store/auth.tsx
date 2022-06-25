import create, { SetState } from "zustand";

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
  setAccessToken: (value) => set(() => ({ accessToken: value })),
  refreshToken: null,
  setRefreshToken: (value) => set(() => ({ refreshToken: value })),
});
export const useAuthStore = create<IAuth>(authStore);
