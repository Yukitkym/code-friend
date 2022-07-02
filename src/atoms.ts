import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist({
	key: "recoil-persist",
	storage: typeof window === "undefined" ? undefined : sessionStorage
});

export const isLoginState = atom({
	key: "isLoginState",
	default: false,
  effects_UNSTABLE: [persistAtom]
});