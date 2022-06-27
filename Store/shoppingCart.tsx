import create, { SetState, GetState } from "zustand";

type CartItem = {
  id: number;
  quantity: number;
};

type IAuth = {
  cartStatus: boolean;
  openCart: () => void;
  closeCart: () => void;
  toogleCart: () => void;
  cartItems: CartItem[];
  increaseCartQuantity: (id: number) => void;
  decreaseCartQuantity: (id: number) => void;
  removeFromCart: (id: number) => void;

  getItemQuantity: (id: number) => number;
  cartQuantity: () => number;
};

const shoppingCart = (set: SetState<IAuth>, get: GetState<IAuth>): IAuth => ({
  cartStatus: false,
  openCart: () => set(() => ({ cartStatus: true })),
  closeCart: () => set(() => ({ cartStatus: false })),
  toogleCart: () => set(({ cartStatus }) => ({ cartStatus: !cartStatus })),
  cartItems: [],
  increaseCartQuantity: (id) =>
    set(({ cartItems }) => {
      if (cartItems.find((item) => item.id === id) == null) {
        return { cartItems: [...cartItems, { id, quantity: 1 }] };
      } else {
        return {
          cartItems: cartItems.map((item) => {
            if (item.id === id) {
              return { ...item, quantity: item.quantity + 1 };
            } else {
              return item;
            }
          }),
        };
      }
    }),
  decreaseCartQuantity: (id) =>
    set(({ cartItems }) => {
      if (cartItems.find((item) => item.id === id)?.quantity === 1) {
        return { cartItems: cartItems.filter((item) => item.id !== id) };
      } else {
        return {
          cartItems: cartItems.map((item) => {
            if (item.id === id) {
              return { ...item, quantity: item.quantity - 1 };
            } else {
              return item;
            }
          }),
        };
      }
    }),
  removeFromCart: (id) =>
    set(({ cartItems }) => {
      return { cartItems: cartItems.filter(({ id: itemId }) => itemId !== id) };
    }),

  getItemQuantity: (id) =>
    get().cartItems.find((item) => item.id === id)?.quantity || 0,

  cartQuantity: () =>
    get().cartItems.reduce((quantity, item) => item.quantity + quantity, 0),
});

export const useShoppingCart = create<IAuth>(shoppingCart);
