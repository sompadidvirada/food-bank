import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Login } from "../api/authen";
import { getAllBranch } from "../api/branch";
import { updateMainSt } from "../api/ManageTeam";

const FoodBankStorage = (set, get) => ({
  user: null,
  token: null,
  branchs: null,
  storage: {},
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
      const res = await getAllBranch(token);
      set({
        branchs: res.data,
      });
    } catch (err) {
      if (err.respone?.status === 401) {
        console.warn("Token expired");
      } else {
        console.error("Fail to fecth Branchs.", err.message);
      }
    }
  },
  setValue: (key, value) => {
    set((state) => ({
      storage: { ...state.storage, [key]: value },
    }));
  },

  // get value by key
  getValue: (key) => get().storage[key],
  updateUser: async (form) => {
    // Accept form as a parameter
    const token = get().token;
    const user = get().user;

    if (!user) {
      console.error("No user logged in.");
      return;
    }

    try {
      const res = await updateMainSt(user.id, form, token);
      set({
        user: res.data.payload,
        token: res.data.token, // Update token if needed
      });
      return res;
    } catch (error) {
      console.error("Error updating user:", error);
    }
  }
});

const usePersist = {
  name: "foodbank-storage",
  storage: createJSONStorage(() => localStorage),
};

const useFoodBankStorage = create(persist(FoodBankStorage, usePersist));

export default useFoodBankStorage;
