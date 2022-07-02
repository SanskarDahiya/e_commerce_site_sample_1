import axios from "axios";
import create, { SetState, GetState } from "zustand";

const updateDb_cart = async (id: string | null, changes: any) => {
  if (!id || !changes) {
    return;
  }
  await axios({
    url: "/api/database",
    method: "POST",
    headers: {
      ["x-custom-table"]: "user_cart",
    },
    data: { id, changes },
  });
};

type CartItem = {
  id: number;
  quantity: number;
};

type IAuth = {
  userId: string | null;
  setUserId: (id: string | null) => void;
  cartStatus: boolean;
  openCart: () => void;
  closeCart: () => void;
  toogleCart: () => void;
  cartItems: CartItem[];
  setCartItems: (items: any) => void;
  increaseCartQuantity: (id: number, price: number) => void;
  decreaseCartQuantity: (id: number) => void;
  removeFromCart: (id: number) => void;

  getItemQuantity: (id: number) => number;
  cartQuantity: () => number;
};

const shoppingCart = (set: SetState<IAuth>, get: GetState<IAuth>): IAuth => ({
  userId: null,
  setUserId: (id) => set(() => ({ userId: id })),
  cartStatus: false,
  openCart: () => set(() => ({ cartStatus: true })),
  closeCart: () => set(() => ({ cartStatus: false })),
  toogleCart: () => set(({ cartStatus }) => ({ cartStatus: !cartStatus })),
  cartItems: [],
  setCartItems: (items) => {
    const cartItems =
      items?.items?.map((id: string) => {
        return {
          id,
          quantity: items?.[id]?.qty,
        };
      }) || [];
    set(() => ({ cartItems }));
  },
  increaseCartQuantity: (resourceId, price) =>
    set(({ cartItems }) => {
      if (cartItems.find((item) => item.id === resourceId) == null) {
        updateDb_cart(get().userId, {
          $set: {
            [resourceId]: {
              price: price,
              qty: 1,
              _updatedOn: new Date(),
              _createdOn: new Date(),
            },
          },
          $push: {
            items: resourceId,
          },
        });
        return { cartItems: [...cartItems, { id: resourceId, quantity: 1 }] };
      } else {
        updateDb_cart(get().userId, {
          $inc: {
            [`${resourceId}.qty`]: 1,
          },
          $set: {
            [`${resourceId}._updatedOn`]: new Date(),
          },
        });
        return {
          cartItems: cartItems.map((item) => {
            if (item.id === resourceId) {
              return { ...item, quantity: item.quantity + 1 };
            } else {
              return item;
            }
          }),
        };
      }
    }),
  decreaseCartQuantity: (resourceId) =>
    set(({ cartItems }) => {
      if (cartItems.find((item) => item.id === resourceId)?.quantity === 1) {
        updateDb_cart(get().userId, {
          $pull: {
            items: resourceId,
          },
          $unset: {
            [resourceId]: 1,
          },
        });
        return {
          cartItems: cartItems.filter((item) => item.id !== resourceId),
        };
      } else {
        updateDb_cart(get().userId, {
          $inc: {
            [`${resourceId}.qty`]: -1,
          },
          $set: {
            [`${resourceId}._updatedOn`]: new Date(),
          },
        });
        return {
          cartItems: cartItems.map((item) => {
            if (item.id === resourceId) {
              return { ...item, quantity: item.quantity - 1 };
            } else {
              return item;
            }
          }),
        };
      }
    }),
  removeFromCart: (resourceId) =>
    set(({ cartItems }) => {
      updateDb_cart(get().userId, {
        $pull: {
          items: resourceId,
        },
        $unset: {
          [resourceId]: 1,
        },
      });
      return {
        cartItems: cartItems.filter(({ id: itemId }) => itemId !== resourceId),
      };
    }),

  getItemQuantity: (id) =>
    get().cartItems.find((item) => item.id === id)?.quantity || 0,

  cartQuantity: () =>
    get().cartItems.reduce((quantity, item) => item.quantity + quantity, 0),
});

export const useShoppingCart = create<IAuth>(shoppingCart);
