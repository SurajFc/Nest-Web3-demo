import create from "zustand";
import { persist } from "zustand/middleware";

const useStore = create(
  persist(
    (set, get) => ({
      isConnected: false,
      setConnect: value => set(state => ({ ...state, isConnected: value })),
      wallet: {
        address: "",
        balance: 0,
        chainId: "",
      },
      setwalletData: value =>
        set(state => ({
          ...state,
          wallet: {
            ...get().wallet,
            ...value,
          },
        })),
      nftCollection: [],
      setNftCollection: value =>
        set(state => ({ ...state, nftCollection: value })),
    }),
    {
      name: "wallet-state", // unique name
      // getStorage: () => sessionStorage, // (optional) by default, 'localStorage' is used
    }
  )
);

export default useStore;
