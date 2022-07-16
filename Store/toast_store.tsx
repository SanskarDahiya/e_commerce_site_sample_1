import { Toast, ToastMessage } from "@Constants/Types";
import create, { SetState, GetState } from "zustand";
type ToastType = "INFO" | "SUCCESS" | "WARNING" | "ERROR";
type IToast = {
  toasts: ToastMessage[];
  addToast: (toast: string | Toast, type: ToastType, timeout?: number) => void;
  setInfo: (toast: string | Toast, timeout?: number) => void;
  setSuccess: (toast: string | Toast, timeout?: number) => void;
  setWarning: (toast: string | Toast, timeout?: number) => void;
  setError: (toast: string | Toast, timeout?: number) => void;
  removeToast: (toastId?: string) => void;
};

const toastStore = (set: SetState<IToast>, get: GetState<IToast>): IToast => ({
  toasts: [],

  setInfo: (toast: string | Toast, timeout?: number) => {
    get().addToast(toast, "INFO", timeout);
  },

  setSuccess: (toast: string | Toast, timeout?: number) => {
    get().addToast(toast, "SUCCESS", timeout);
  },

  setWarning: (toast: string | Toast, timeout?: number) => {
    get().addToast(toast, "WARNING", timeout);
  },

  setError: (toast: string | Toast, timeout?: number) => {
    get().addToast(toast, "ERROR", timeout);
  },

  addToast: (toast: string | Toast, type: ToastType, timeout?: number) => {
    set(({ toasts }) => {
      if (!timeout || !+timeout) {
        timeout = 2000;
      }
      timeout = timeout <= 100 ? 100 : timeout;
      if (typeof toast === "string") {
        toast = { message: toast };
      }
      let newToast: ToastMessage;
      const d = new Date();
      newToast = {
        ...toast,
        _id: `id__${d.getTime()}__${Math.floor(Math.random() * 10000)}`,
        type,
        _createdOn: d,
        timeout: timeout,
        _expireOn: new Date(d.getTime() + timeout),
      };
      toasts.push(newToast);
      return { toasts: [...toasts] };
    });
  },
  removeToast: (toastId) => {
    set(({ toasts }) => {
      toasts = toasts.filter(
        ({ timeout, _createdOn }) =>
          _createdOn.getTime() + timeout > new Date().getTime()
      );
      if (toastId) {
        toasts = toasts.filter((toast) => toast._id !== toastId);
      }
      return { toasts };
    });
  },
});

export const useToastStore = create<IToast>(toastStore);
