import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Login } from "../api/authen";
import { getAllBranch } from "../api/branch";

const FoodBankStorage = (set, get) => ({
  user: null,
  token: null,
  branchs: null,
  actionLogin: async (form) => {
    const res = await Login(form);
    set({
      user: res.data.payload,
      token: res.data.token,
    });
    return res;
  },
  getBrnachs: async () => {
    const token = get().token;
    try {
        const res = await getAllBranch(token)
        set({
            branchs: res.data
        })
    } catch (err) {
      if (err.respone?.status === 401) {
        console.warn("Token expired");
      } else {
        console.error("Fail to fecth Branchs.", err.message);
      }
    }
  },
});

const usePersist = {
  name: "foodbank-storage",
  storage: createJSONStorage(() => localStorage),
};

const useFoodBankStorage = create(persist(FoodBankStorage, usePersist));

export default useFoodBankStorage;
