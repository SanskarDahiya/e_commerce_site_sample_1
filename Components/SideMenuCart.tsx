import "twin.macro";
import React from "react";
import { useShoppingCart } from "../Store/shoppingCart";

function SideMenuCart() {
  const { cartItem, cartStatus, closeCart } = useShoppingCart((s) => ({
    cartItem: s.cartItem,
    cartStatus: s.cartStatus,
    toogleCart: s.toogleCart,
    closeCart: s.closeCart,
  }));
  const products = cartItem.items || [];

  const totalPrice = products.reduce(
    (acc: number, resourceId: string): number => {
      let { price, qty } = cartItem[resourceId] || {};
      price = +price;
      qty = +qty || 0;
      if (!price || typeof price !== "number") return acc;
      price = price * qty;
      acc = acc + price;
      return +acc.toFixed(2);
    },
    0
  );

  const handleCloseMenu = () => {
    closeCart();
  };
  const handleCheckout = () => {};
  if (!cartStatus) return null;
  return (
    <div tw="">
      <div tw="fixed inset-0 overflow-hidden z-[999] bg-black opacity-50" />
      <div tw="fixed inset-0 overflow-hidden z-[999] ">
        <div tw="absolute inset-0 overflow-hidden">
          {/* <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay tw="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child> */}

          <div tw="fixed inset-y-0 right-0 pl-10 max-w-full flex">
            {/* <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            > */}
            <div tw="w-screen max-w-md">
              <div tw="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                <div tw="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                  <div tw="flex items-start justify-between">
                    <div tw="text-lg font-medium text-gray-900">Koszyk</div>
                    <div tw="ml-3 h-7 flex items-center">
                      <button
                        type="button"
                        tw="-m-2 p-2 text-gray-400 hover:text-gray-500"
                        onClick={handleCloseMenu}
                      >
                        <span tw="sr-only">Your Orders</span>
                        {/* <XIcon tw="h-6 w-6" aria-hidden="true" /> */}X
                      </button>
                    </div>
                  </div>
                  <div tw="mt-8 flow-root">
                    SingleItemLists
                    {JSON.stringify(products)}
                    {/* <CartItems products={products} /> */}
                  </div>
                </div>
                <div tw="border-t border-gray-200 py-6 px-4 sm:px-6">
                  <div tw="flex justify-between text-base font-medium text-gray-900">
                    <p>Total:</p>
                    <p>{totalPrice} :Rs</p>
                  </div>

                  <div tw="mt-6">
                    {products.length > 0 ? (
                      <button
                        onClick={handleCheckout}
                        tw="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        Checkout
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
            {/* </Transition.Child> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SideMenuCart;
