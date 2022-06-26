import create, { SetState } from "zustand";

type IAuth = {
  items: any[];
  replaceAll: (list: any) => void;
  addItem: (value: any, index?: number) => void;
  removeItem: (value: any, index?: number) => void;
};

const itemStore = (set: SetState<IAuth>): IAuth => ({
  items: [],
  replaceAll: (list) => {
    set(() => ({ items: [...list] }));
  },
  addItem: (value, index) => {
    set(({ items }) => {
      items = [...items];
      if (index) {
        items.splice(index, 0, value);
      } else {
        items.push(value);
      }
      return { items };
    });
  },
  removeItem: (value, index) => {
    set(({ items }) => {
      items = [...items];
      if (index) {
        items.splice(index, 1);
      } else {
        items = items.filter((item) => item.id !== value.id);
      }
      return { items };
    });
  },
});

export const useItemStore = create<IAuth>(itemStore);
