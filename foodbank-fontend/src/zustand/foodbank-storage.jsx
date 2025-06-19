import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Login } from "../api/authen";

const FoodBankStorage = (set, get) => ({
    user: null,
    token: null,
    actionLogin: async(form) => {
        const res = await Login(form)
        set({
            user: res.data.payload,
            token: res.data.token
        })
        return res
    }
})

const usePersist = {
    name: "foodbank-storage",
    storage: createJSONStorage(() => localStorage)
}

const useFoodBankStorage = create(persist(FoodBankStorage, usePersist))

export default useFoodBankStorage