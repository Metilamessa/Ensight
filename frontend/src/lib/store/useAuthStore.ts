import { create } from "zustand";

interface AuthState {
  isLoggedIn: boolean;
  setLoggedIn: (value: boolean) => void;
}

//eslint-disable-next-line
export const useAuthStore = create<AuthState>((set: any) => ({
  isLoggedIn: false,
  //eslint-disable-next-line
  setLoggedIn: (value: any) => set({ isLoggedIn: value }),
}));
