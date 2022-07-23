import React, { useCallback, useEffect, useState } from "react";
import { useShoppingCart } from "@Store/shoppingCart";
import { useItemStore } from "@Store/itemlist";
import Image from "next/image";
import { ItemInterface } from "@Constants/Types";
import Loading from "@Helpers/Loading";
import { fetchitems } from "@Functions/fetchItems";

interface MyProps {
  data: any;
}

function SingleCartitem({ data }: MyProps) {
  const getItem = useItemStore((state) => state.getItem);

  const { increaseCartQuantity, decreaseCartQuantity, removeFromCart } =
    useShoppingCart();
  const { _id: resourceId, price: bookedPrice, qty } = data || {};
  const [itemInfo, setItemInfo] = useState<ItemInterface>();
  useEffect(() => {
    let mounted = { current: true };
    const fetchItemDetails = async () => {
      const cacheItemInfo = getItem(resourceId);
      if (cacheItemInfo) {
        setItemInfo(cacheItemInfo);
        return;
      }
      const itemResult = await fetchitems({ filter: { _id: resourceId } });
      const itemData = itemResult.data[0];
      if (!itemData) {
        removeFromCart(resourceId);
      } else if (mounted.current) {
        setItemInfo(itemResult.data[0]);
      }
    };
    fetchItemDetails();
    return () => {
      mounted.current = false;
    };
  }, []);

  const { title, actualPrice, image } = itemInfo || {};

  const addQuantity = (e: any) => {
    e.preventDefault();
    actualPrice && increaseCartQuantity(resourceId, actualPrice);
  };
  const removeQuantity = (e: any) => {
    e.preventDefault();
    decreaseCartQuantity(resourceId);
  };

  const handleDelete = () => {
    removeFromCart(data._id);
  };

  if (!itemInfo) {
    return (
      <div className="py-6 my-4 relative">
        <Loading text="Fetching Item" className="h-10" />
      </div>
    );
  }
  return (
    <div className="py-6 flex relative">
      <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
        {image?.url ? (
          <Image
            src={image.url}
            quality={80}
            width="100%"
            height="100%"
            layout="responsive"
            objectFit="contain"
            alt="Product Image"
          />
        ) : (
          "No Image Found"
        )}
      </div>
      <div className="ml-4 flex-1 flex flex-col">
        <div className="flex justify-between text-base font-medium text-gray-900">
          <div className="flex flex-col">
            <h3>{title}</h3>
            <h3 className="font-normal text-[0.8rem]">QTY-{qty}</h3>
          </div>
          {bookedPrice === actualPrice ? (
            <p className="ml-4">{actualPrice}</p>
          ) : (
            <div className="flex flex-col">
              <p className="ml-4 line-through">{actualPrice}</p>
              <p className="ml-4 text-green-500">{bookedPrice}</p>
            </div>
          )}
        </div>
        <div className="flex-1 flex items-end justify-between text-sm">
          <div className="flex justify-between w-full">
            <button
              type="button"
              onClick={() => handleDelete()}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Delete
            </button>
            <div>
              <div className="flex justify-center">
                <svg
                  onClick={removeQuantity}
                  className="fill-current text-gray-600 w-3"
                  viewBox="0 0 448 512"
                >
                  <path d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
                </svg>
                <div className="mx-2 text-center w-5">{qty}</div>
                <svg
                  onClick={addQuantity}
                  className="fill-current text-gray-600 w-3"
                  viewBox="0 0 448 512"
                >
                  <path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleCartitem;
