import React from "react";
import { useShoppingCart } from "../Store/shoppingCart";

function Cart() {
  const cartItems = useShoppingCart((s) => s.cartItems);

  return (
    <div>
      cart
      {JSON.stringify(cartItems)}
    </div>
  );
}

export default Cart;
