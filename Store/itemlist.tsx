import create, { SetState, GetState } from "zustand";
import { ItemInterface } from "@Constants/Types";

type IAuth = {
  items: ItemInterface[];
  replaceAll: (list: ItemInterface[]) => void;
  getItem: (resourceId: string, defaultValue?: ItemInterface) => ItemInterface;
  addItems: (value: ItemInterface[]) => void;
  addItem: (value: ItemInterface, index?: number) => void;
  removeItem: (value: ItemInterface, index?: number) => void;
  replaceItem: (value: ItemInterface, index?: number | string) => void;
};

const itemStore = (set: SetState<IAuth>, get: GetState<IAuth>): IAuth => ({
  items: [],
  getItem: (resourceId, defaultValue) => {
    let itemValue = get().items.filter(({ _id }) => _id === resourceId);
    return itemValue[0] || defaultValue;
  },
  replaceAll: (list) => {
    set(() => ({ items: [...list] }));
  },
  replaceItem: (value, index) => {
    set(({ items }) => {
      if (typeof index === "number") {
        items[index] = { ...items[index], ...value };
      } else {
        items = items.map((item) => {
          if (item._id === index) {
            item = { ...item, ...value };
          }
          return item;
        });
      }
      return { items };
    });
  },
  addItems: (list) => {
    set(({ items }) => ({ items: [...items, ...list] }));
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
        items = items.filter((item) => item._id !== value._id);
      }
      return { items };
    });
  },
});

export const useItemStore = create<IAuth>(itemStore);
