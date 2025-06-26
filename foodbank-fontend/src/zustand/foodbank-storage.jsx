import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Login } from "../api/authen";
import { getAllBranch } from "../api/branch";
import { updateMainSt } from "../api/ManageTeam";
import { getAllProduct } from "../api/product";

const FoodBankStorage = (set, get) => ({
  user: null,
  token: null,
  branchs: null,
  products: null,
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
  setBranchs: (newBranches) => set({ branchs: newBranches }),
  updateUser: async (form) => {
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
        token: res.data.token,
      });
      return res;
    } catch (error) {
      console.error("Error updating user:", error);
    }
  },
  getProduct: async () => {
    const token = get().token
    try{
      const ress = await getAllProduct(token)
      set({ products : ress.data })
    }catch(err) {
      console.log(err)
    }
  }
});

const usePersist = {
  name: "foodbank-storage",
  storage: createJSONStorage(() => localStorage),
};

const useFoodBankStorage = create(persist(FoodBankStorage, usePersist));

export default useFoodBankStorage;
