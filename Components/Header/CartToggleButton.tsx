import React, { Fragment, memo } from "react";
import { useShoppingCart } from "@Store/shoppingCart";

function CartToggleButton() {
  const { cartItem, toogleCart } = useShoppingCart((s) => ({
    toogleCart: s.toogleCart,
    cartItem: s.cartItem,
  }));
  const totalItems = cartItem?.items?.length || 0;
  return (
    <Fragment>
      <div
        className="pl-3 inline-block no-underline hover:text-black relative"
        onClick={() => {
          toogleCart();
        }}
      >
        {totalItems > 0 && (
          <div className="absolute bottom-[60%] left-[80%] font-size[small]">
            {totalItems}
          </div>
        )}
        <svg
          className="fill-current hover:text-black"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M21,7H7.462L5.91,3.586C5.748,3.229,5.392,3,5,3H2v2h2.356L9.09,15.414C9.252,15.771,9.608,16,10,16h8 c0.4,0,0.762-0.238,0.919-0.606l3-7c0.133-0.309,0.101-0.663-0.084-0.944C21.649,7.169,21.336,7,21,7z M17.341,14h-6.697L8.371,9 h11.112L17.341,14z" />
          <circle cx="10.5" cy="18.5" r="1.5" />
          <circle cx="17.5" cy="18.5" r="1.5" />
        </svg>
      </div>
    </Fragment>
  );
}
export default memo(CartToggleButton);
