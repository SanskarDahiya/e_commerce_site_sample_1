import create, { SetState, GetState } from "zustand";

type IAuth = {
  items: any[];
  replaceAll: (list: any) => void;
  getItem: (resourceId: string) => Promise<any>;
  addItem: (value: any, index?: number) => void;
  removeItem: (value: any, index?: number) => void;
  replaceItem: (value: any, index: number) => void;
};

const itemStore = (set: SetState<IAuth>, get: GetState<IAuth>): IAuth => ({
  items: [],
  getItem: async (resourceId) => {
    let itemValue = get().items.filter(({ _id }) => _id === resourceId);
    return itemValue;
  },
  replaceAll: (list) => {
    set(() => ({ items: [...list] }));
  },
  replaceItem: (value, index) => {
    set(({ items }) => {
      items[index] = { ...items[index], ...value };
      return { items };
    });
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
