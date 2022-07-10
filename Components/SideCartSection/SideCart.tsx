import React, { Fragment, useEffect, useRef } from "react";
import { useShoppingCart } from "@Store/shoppingCart";
import SingleCartitem from "./CartItemView";
import { useToastStore } from "@Store/toast_store";
import SlideAnimation from "@Helpers/SlideAnimation";

function SideMenuCart() {
  const setInfo = useToastStore((s) => s.setInfo);
  const transitionRef = useRef({ closeModal: () => {} });
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

  const handleCheckout = () => {
    setInfo("Updating Soon");
  };

  useEffect(() => {
    if (!cartStatus) return;

    const HandleClick = (e: KeyboardEvent) => {
      if (e.key === "Escape" && transitionRef.current.closeModal) {
        transitionRef.current.closeModal();
      }
    };
    document.addEventListener("keyup", HandleClick);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keyup", HandleClick);
      document.body.style.overflow = "unset";
    };
  }, [cartStatus]);

  if (!cartStatus) return null;
  return (
    <Fragment>
      <div className="fixed inset-0 overflow-hidden bg-black opacity-50" />
      <div
        className="fixed inset-0 overflow-hidden"
        onClick={() => {
          console.log("Close modal from here");
          if (transitionRef.current.closeModal) {
            transitionRef.current.closeModal();
          }
        }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
            <SlideAnimation
              className="flex"
              inTransition="translate-x-[100%]"
              outTransition="translate-x-[0]"
              onRemove={() => {
                handleCloseMenu();
              }}
            >
              {({ closeModal }) => {
                transitionRef.current.closeModal = closeModal;
                return (
                  <div
                    className="w-screen max-w-md"
                    // Prevent Closing Modal on cliking on black space
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                      <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                        <div className="flex items-start justify-between">
                          <div className="text-lg font-medium text-gray-900">
                            Koszyk
                          </div>
                          <div className="ml-3 h-7 flex items-center">
                            <button
                              type="button"
                              className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                              onClick={closeModal}
                            >
                              <span className="sr-only">Your Orders</span>
                              {/* <XIcon className="h-6 w-6" aria-hidden="true" /> */}
                              X
                            </button>
                          </div>
                        </div>
                        {products.length ? (
                          <div className="mt-8 flow-root">
                            <div className="-my-6 divide-y divide-gray-200">
                              {products.map(
                                (resourceId: string, index: number) => (
                                  <SingleCartitem
                                    key={resourceId + index}
                                    data={{
                                      _id: resourceId,
                                      ...cartItem[resourceId],
                                    }}
                                  />
                                )
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-between text-base font-medium text-gray-900 py-6 px-4 sm:px-6">
                            Cart is empty
                          </div>
                        )}
                      </div>
                      <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <p>Total:</p>
                          <p>{totalPrice} :Rs</p>
                        </div>

                        <div className="mt-6">
                          {products.length > 0 ? (
                            <button
                              onClick={handleCheckout}
                              className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                              Checkout
                            </button>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }}
            </SlideAnimation>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default SideMenuCart;
