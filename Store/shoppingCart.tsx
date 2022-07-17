import axios from "@Helpers/Axios";
import create, { SetState, GetState } from "zustand";
import { CartInterface } from "@Constants/Types";
import { updateCartInfo } from "@Functions/updateInfo";

type IAuth = {
  userId: string;
  setUserId: (id: string) => void;
  cartStatus: boolean;
  openCart: () => void;
  closeCart: () => void;
  toogleCart: () => void;
  emptyCart: () => void;
  cartItem: CartInterface | any;
  setCartItems: (item: CartInterface) => void;
  increaseCartQuantity: (id: string, price: number) => void;
  decreaseCartQuantity: (id: string) => void;
  removeFromCart: (id: string) => void;
  getItemQuantity: (id: string) => number;
};

const shoppingCart = (set: SetState<IAuth>, get: GetState<IAuth>): IAuth => ({
  userId: "",
  setUserId: (id) => set(() => ({ userId: id })),
  cartStatus: false,
  openCart: () => set(() => ({ cartStatus: true })),
  closeCart: () => set(() => ({ cartStatus: false })),
  toogleCart: () => set(({ cartStatus }) => ({ cartStatus: !cartStatus })),
  cartItem: { items: [] },
  emptyCart: () => set(() => ({ cartItem: { items: [] } })),
  setCartItems: (item) => {
    set(() => ({ cartItem: item }));
  },
  increaseCartQuantity: (resourceId, price) =>
    set(({ cartItem }) => {
      const userId = get().userId;
      if (cartItem[resourceId]) {
        updateCartInfo(userId, {
          $inc: { [`${resourceId}.qty`]: 1 },
          $set: { [`${resourceId}._updatedOn`]: new Date() },
        });
        cartItem[resourceId].qty += 1;
      } else {
        updateCartInfo(userId, {
          $set: {
            [resourceId]: {
              price,
              qty: 1,
              _updatedOn: new Date(),
              _createdOn: new Date(),
            },
          },
          $push: { items: resourceId },
        });

        cartItem[resourceId] = { qty: 1, price };
        cartItem.items = cartItem?.items || [];
        cartItem.items.push(resourceId);
      }
      return { cartItem: { ...cartItem } };
    }),

  decreaseCartQuantity: (resourceId) =>
    set(({ cartItem }) => {
      const userId = get().userId;
      if (cartItem[resourceId]?.qty <= 1) {
        delete cartItem[resourceId];
        cartItem.items = cartItem.items.filter(
          (id: string) => id !== resourceId
        );
        updateCartInfo(userId, {
          $pull: { items: resourceId },
          $unset: { [resourceId]: 1 },
        });
      } else {
        cartItem[resourceId] = {
          ...cartItem[resourceId],
          qty: cartItem[resourceId].qty - 1,
        };
        updateCartInfo(userId, {
          $inc: { [`${resourceId}.qty`]: -1 },
          $set: { [`${resourceId}._updatedOn`]: new Date() },
        });
      }
      return { cartItem: { ...cartItem } };
    }),
  removeFromCart: (resourceId) =>
    set(({ cartItem }) => {
      const userId = get().userId;
      updateCartInfo(userId, {
        $pull: { items: resourceId },
        $unset: { [resourceId]: 1 },
      });
      delete cartItem[resourceId];
      cartItem.items = cartItem.items.filter((id: string) => id !== resourceId);
      return { cartItem: { ...cartItem } };
    }),

  getItemQuantity: (resourceId) => get().cartItem?.[resourceId]?.qty || 0,
});

export const useShoppingCart = create<IAuth>(shoppingCart);
