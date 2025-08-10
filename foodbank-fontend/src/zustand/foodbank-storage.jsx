import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Login } from "../api/authen";
import { getAllBranch } from "../api/branch";
import { updateMainSt } from "../api/ManageTeam";
import { getAllProduct, getCategorys } from "../api/product";
import axios from "axios";
const URL = import.meta.env.VITE_API_URL;

const FoodBankStorage = (set, get) => ({
  user: null,
  token: null,
  branchs: null,
  products: null,
  categorys: null,
  dataTrack: null,
  totalData: null,
  queryForm: {
    startDate: "",
    endDate: "",
  },
  barSell: null,
  barSend: null,
  barExp: null,
  pieSell: null,
  pieSend: null,
  pieExp: null,
  lineChartData: null,
  calendar: null,
  imageTrack: null,
  dateConfirmOrder: {
    orderDate: "",
  },
  getImageTrack: (newData) => {
    set({ imageTrack: newData });
  },
  getCalendar: async (id) => {
    try {
      const res = await axios.get(`${URL}/getcalendar/${id}`);
      set({ calendar: res.data });
    } catch (err) {
      console.error("Failed to fetch brachs:", err.message);
    }
  },
  updateCalendarEventStatus: (updatedEvent) => {
    set((state) => ({
      calendar: state.calendar.map((event) =>
        String(event.id) === String(updatedEvent.id)
          ? {
              ...event,
              extendedProps: {
                ...event.extendedProps,
                isSuccess: updatedEvent.isSuccess,
              },
            }
          : event
      ),
    }));
  },
  updateCalendarEventPayment: (updatedEvent) => {
    set((state) => ({
      calendar: state.calendar.map((event) =>
        String(event.id) === String(updatedEvent.id)
          ? {
              ...event,
              extendedProps: {
                ...event.extendedProps,
                isPaySuccess: updatedEvent.isPaySuccess,
              },
            }
          : event
      ),
    }));
  },
  setLineChartData: (newData) => {
    set({ lineChartData: newData });
  },
  setPieSell: (newData) => {
    set({ pieSell: newData }); // <-- Add function to update data
  },
  setPieSend: (newData) => {
    set({ pieSend: newData }); // <-- Add function to update data
  },
  setPieExp: (newData) => {
    set({ pieExp: newData }); // <-- Add function to update data
  },
  setBarSell: (newData) => {
    set({ barSell: newData }); // <-- Add function to update data
  },
  setBarSend: (newData) => {
    set({ barSend: newData }); // <-- Add function to update data
  },
  setBarExp: (newData) => {
    set({ barExp: newData }); // <-- Add function to update data
  },
  setTotalData: (newData) => {
    set({ totalData: newData });
  },
  setDataTrack: (newData) => {
    set({ dataTrack: newData });
  },
  setQueryForm: (key, value) => {
    set((state) => ({
      queryForm: {
        ...state.queryForm,
        [key]: value,
      },
    }));
  },
  setConfirmOrder: (key, value) => {
    set((state) => ({
      dateConfirmOrder: {
        ...state.dateConfirmOrder,
        [key]: value,
      },
    }));
  },
  actionLogin: async (form) => {
    const res = await Login(form);
    set({
      user: res.data.payload,
      token: res.data.token,
    });
    return res;
  },
  getBrnachs: async (force = false) => {
    const token = get().token;
    const existingBranchs = get().branchs;

    if (!force && existingBranchs && existingBranchs.length > 0) {
      return;
    }

    try {
      const res = await getAllBranch(token);
      set({ branchs: res.data });
    } catch (err) {
      if (err.response?.status === 401) {
        console.warn("Token expired");
      } else {
        console.error("Fail to fetch Branchs.", err.message);
      }
    }
  },
  setBranchs: (newBranches) => set({ branchs: newBranches }),
  updateUser: async (form, imageFile = null) => {
    const token = get().token;
    const user = get().user;

    if (!user) {
      console.error("No user logged in.");
      return;
    }

    try {
      const res = await updateMainSt(user.id, form, token);
      // Upload image if there's a file and signed URL
      if (imageFile && res.data.imageUploadUrl) {
        await axios.put(res.data.imageUploadUrl, imageFile, {
          headers: {
            "Content-Type": imageFile.type,
          },
        });
      }

      // Update Zustand state with new token + user info
      set({
        user: res.data.payload,
        token: res.data.token,
      });

      return res;
    } catch (error) {
      console.error("Error updating user:", error);
    }
  },

  getProduct: async (force = false) => {
    const token = get().token;
    const existingProducts = get().products;

    if (!force && existingProducts && existingProducts.length > 0) {
      return;
    }

    try {
      const ress = await getAllProduct(token);
      set({ products: ress.data });
    } catch (err) {
      console.log("Failed to fetch products:", err);
    }
  },
  getCategory: async (force = false) => {
    const token = get().token;
    const existingCategories = get().categorys;

    if (!force && existingCategories && existingCategories.length > 0) {
      return;
    }

    try {
      const ress = await getCategorys(token);
      set({ categorys: ress.data.data });
    } catch (err) {
      console.log("Failed to fetch categories:", err);
    }
  },
});

const usePersist = {
  name: "foodbank-storage",
  storage: createJSONStorage(() => localStorage),
};

const useFoodBankStorage = create(persist(FoodBankStorage, usePersist));

export default useFoodBankStorage;
