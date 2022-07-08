import tw from "twin.macro";
import React, { memo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useShoppingCart } from "@store/shoppingCart";
import { useAuthStore } from "@store/auth";
import axios from "@helpers/Axios";
import { useItemStore } from "@store/itemlist";
import { ItemInterface } from "@constants/Types";

interface MyProps {
  index: number;
  item: ItemInterface;
}
function SingleItemSmall({ item, index }: MyProps) {
  const {
    _id: resourceId,
    imageUrl,
    price,
    actualPrice,
    title,
    favourates,
  } = item;
  const user = useAuthStore((s) => s.user);
  const userId = user?._id?.toString();
  const replaceItem = useItemStore((state) => state.replaceItem);

  const {
    getItemQuantity,
    increaseCartQuantity,
    decreaseCartQuantity,
    removeFromCart,
    setUserId,
    userId: currentUserId,
  } = useShoppingCart();

  useEffect(() => {
    if (userId && userId !== currentUserId) {
      setUserId(userId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId, userId]);
  const currentItemQuantity = getItemQuantity(resourceId);
  const isFavoriteMark = userId ? favourates?.includes(userId) : false;

  const updateDb = async (id: string, changes: any) => {
    await axios({
      url: "/api/database",
      method: "POST",
      headers: {
        ["x-custom-table"]: "items",
      },
      data: { id, changes },
    });
  };
  const addQuantity = (e: any) => {
    e.preventDefault();
    increaseCartQuantity(resourceId, actualPrice);
  };
  const removeQuantity = (e: any) => {
    e.preventDefault();
    decreaseCartQuantity(resourceId);
  };
  const removeItem = (e: any) => {
    e.preventDefault();
    removeFromCart(resourceId);
  };

  const favCss = [tw`h-6 w-6 fill-current text-gray-500 hover:text-black`];
  if (isFavoriteMark) {
    favCss.push(tw`text-red-600 hover:text-red-400`);
  }
  return (
    <div
      className="itemList1212"
      tw="w-full md:w-1/3 xl:w-1/4 p-6 flex flex-col"
    >
      <Link href={"/items/" + resourceId} passHref>
        <a>
          <div tw="hover:flex-grow hover:shadow-lg">
            <Image
              src={imageUrl}
              alt="Image-Section"
              quality={80}
              height={400}
              width={400}
            />
          </div>

          <div tw="pt-3 flex items-center justify-between">
            <p>{title}</p>
            {currentItemQuantity === 0 ? (
              <svg
                onClick={(e) => {
                  e.preventDefault();
                  if (!userId) {
                    alert("Please Login");
                    return;
                  }
                  if (!Array.isArray(item.favourates)) {
                    item.favourates = [];
                  }
                  if (isFavoriteMark) {
                    item.favourates = item.favourates.filter(
                      (id) => id !== userId
                    );
                    updateDb(resourceId, {
                      $pull: {
                        favourates: userId,
                      },
                    });
                  } else {
                    item.favourates.push(userId);
                    updateDb(resourceId, {
                      $addToSet: {
                        favourates: userId,
                      },
                    });
                  }
                  replaceItem(item, index);
                }}
                // @ts-ignore
                css={favCss}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M12,4.595c-1.104-1.006-2.512-1.558-3.996-1.558c-1.578,0-3.072,0.623-4.213,1.758c-2.353,2.363-2.352,6.059,0.002,8.412 l7.332,7.332c0.17,0.299,0.498,0.492,0.875,0.492c0.322,0,0.609-0.163,0.792-0.409l7.415-7.415 c2.354-2.354,2.354-6.049-0.002-8.416c-1.137-1.131-2.631-1.754-4.209-1.754C14.513,3.037,13.104,3.589,12,4.595z M18.791,6.205 c1.563,1.571,1.564,4.025,0.002,5.588L12,18.586l-6.793-6.793C3.645,10.23,3.646,7.776,5.205,6.209 c0.76-0.756,1.754-1.172,2.799-1.172s2.035,0.416,2.789,1.17l0.5,0.5c0.391,0.391,1.023,0.391,1.414,0l0.5-0.5 C14.719,4.698,17.281,4.702,18.791,6.205z" />
              </svg>
            ) : (
              <div onClick={removeItem}>Delete</div>
            )}
          </div>
          <div tw="flex items-center justify-between">
            <p tw="pt-1 text-gray-900">{price}</p>
            {currentItemQuantity === 0 ? (
              <div onClick={addQuantity}>+ Add To Cart</div>
            ) : (
              <div tw="flex justify-center">
                <svg
                  onClick={removeQuantity}
                  tw="fill-current text-gray-600 w-3"
                  viewBox="0 0 448 512"
                >
                  <path d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
                </svg>
                <div tw="mx-2 text-center w-5">{currentItemQuantity}</div>
                <svg
                  onClick={addQuantity}
                  tw="fill-current text-gray-600 w-3"
                  viewBox="0 0 448 512"
                >
                  <path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
                </svg>
              </div>
            )}
          </div>
        </a>
      </Link>
    </div>
  );
}

export default memo(SingleItemSmall);
