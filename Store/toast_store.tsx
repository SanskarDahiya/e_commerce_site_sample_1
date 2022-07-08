import { Toast, ToastMessage } from "@constants/Types";
import create, { SetState, GetState } from "zustand";
type ToastType = "INFO" | "SUCCESS" | "WARNING" | "ERROR";
type IToast = {
  toasts: ToastMessage[];
  addToast: (toast: Toast, type: ToastType, timeout?: number) => void;
  setInfo: (toast: Toast, timeout?: number) => void;
  setSuccess: (toast: Toast, timeout?: number) => void;
  setWarning: (toast: Toast, timeout?: number) => void;
  setError: (toast: Toast, timeout?: number) => void;
  removeToast: (toastId?: string) => void;
};

const toastStore = (set: SetState<IToast>, get: GetState<IToast>): IToast => ({
  toasts: [],

  setInfo: (toast: Toast, timeout?: number) => {
    get().addToast(toast, "INFO", timeout);
  },

  setSuccess: (toast: Toast, timeout?: number) => {
    get().addToast(toast, "SUCCESS", timeout);
  },

  setWarning: (toast: Toast, timeout?: number) => {
    get().addToast(toast, "WARNING", timeout);
  },

  setError: (toast: Toast, timeout?: number) => {
    get().addToast(toast, "ERROR", timeout);
  },

  addToast: (toast: Toast, type: ToastType, timeout?: number) => {
    set(({ toasts }) => {
      if (!timeout || !+timeout) {
        timeout = 2000;
      }
      timeout = timeout <= 100 ? 100 : timeout;
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
      // toasts = toasts.filter(
      //   ({ timeout, _createdOn }) =>
      //     _createdOn.getTime() + timeout > new Date().getTime()
      // );
      if (toastId) {
        toasts = toasts.filter((toast) => toast._id !== toastId);
      }
      return { toasts };
    });
  },
});

export const useToastStore = create<IToast>(toastStore);
