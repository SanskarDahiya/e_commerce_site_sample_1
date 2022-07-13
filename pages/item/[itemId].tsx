import { ItemInterface } from "@Constants/Types";
import { fetchitems } from "@Functions/fetchItems";
import axios from "@Helpers/Axios";
import { useAuthStore } from "@Store/auth";
import { useItemStore } from "@Store/itemlist";
import { useShoppingCart } from "@Store/shoppingCart";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import Image from "next/image";
import React, { Fragment, useEffect, useState } from "react";

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

interface SingleItemProps {
  item: ItemInterface;
}

function SingleItem({ item }: SingleItemProps) {
  const { _id: resourceId } = item;
  const [isEditMode, setEditMode] = useState(false);

  const { user, isAdmin } = useAuthStore((s) => ({
    user: s.user,
    isAdmin: s.isEditEnable || true,
  }));
  const userId = user?._id?.toString() || "";
  const { replaceItem, getItem } = useItemStore((state) => ({
    replaceItem: state.replaceItem,
    getItem: state.getItem,
  }));
  const { imageUrl, price, actualPrice, title, favourates, description } =
    getItem(resourceId, item);

  const toggleEdit = () => isAdmin && setEditMode((e) => !e);

  const updateInfo = (field: string, value: any) => {
    const itemInfo = getItem(resourceId, item);
    // @ts-ignore
    const currValue = itemInfo[field];
    if (value !== currValue) {
      const changes = {
        [field]: value,
      } as ItemInterface;
      replaceItem(changes, resourceId);
      updateDb(resourceId, {
        $set: changes,
      });
    }
  };

  return (
    <div className="w-full flex flex-col md:flex-row relative">
      {isAdmin && (
        <div className="absolute top-0 right-0 px-4 py-2" onClick={toggleEdit}>
          {isEditMode ? "Done" : "Edit"}
        </div>
      )}
      <div className="h-full w-full md:w-1/2 p-6 flex justify-center">
        <Image
          onClick={() => {
            if (!isEditMode) return;
            // we will change the image
            console.log("Change Image");
          }}
          src={imageUrl}
          alt="Image-Section"
          quality={80}
          height={400}
          width={400}
        />
      </div>
      <div className="w-full md:w-1/2 p-6 flex flex-col justify-center">
        <p className="font-bold	text-xl	">{title}</p>
        <div className="py-3">
          <span className="font-bold">Description</span>
          <p>
            {isEditMode ? (
              <textarea
                defaultValue={description}
                onBlur={(e) => {
                  const newValue = e.target.value;
                  updateInfo("description", newValue);
                }}
                className="w-full border-b-2 border-black"
                rows={5}
              />
            ) : (
              description
            )}
          </p>
        </div>
        <BottomSection
          price={price}
          userId={userId}
          item={item}
          replaceItem={replaceItem}
        />
      </div>
    </div>
  );
}

export default SingleItem;

interface BottomSectionProps {
  price: string;
  userId: string;
  item: ItemInterface;
  replaceItem: (value: ItemInterface, index?: number | string) => void;
}
const BottomSection = ({
  price,
  userId,
  item,
  replaceItem,
}: BottomSectionProps) => {
  const { _id: resourceId, favourates = [], actualPrice } = item || {};
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
  const favCss = ["h-6 w-6 fill-current text-gray-500 hover:text-black"];
  if (isFavoriteMark) {
    favCss.push("text-red-600 hover:text-red-400");
  }

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
  return (
    <Fragment>
      <div className="pt-3 w-full flex flex-row">
        <p className="pt-1 w-1/2 text-gray-900">{price}</p>
        <div>
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
                item.favourates = item.favourates.filter((id) => id !== userId);
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
              replaceItem(item, resourceId);
            }}
            className={favCss.join(" ")}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M12,4.595c-1.104-1.006-2.512-1.558-3.996-1.558c-1.578,0-3.072,0.623-4.213,1.758c-2.353,2.363-2.352,6.059,0.002,8.412 l7.332,7.332c0.17,0.299,0.498,0.492,0.875,0.492c0.322,0,0.609-0.163,0.792-0.409l7.415-7.415 c2.354-2.354,2.354-6.049-0.002-8.416c-1.137-1.131-2.631-1.754-4.209-1.754C14.513,3.037,13.104,3.589,12,4.595z M18.791,6.205 c1.563,1.571,1.564,4.025,0.002,5.588L12,18.586l-6.793-6.793C3.645,10.23,3.646,7.776,5.205,6.209 c0.76-0.756,1.754-1.172,2.799-1.172s2.035,0.416,2.789,1.17l0.5,0.5c0.391,0.391,1.023,0.391,1.414,0l0.5-0.5 C14.719,4.698,17.281,4.702,18.791,6.205z" />
          </svg>
        </div>
      </div>

      <div className=" pt-3 w-full flex flex-row">
        {currentItemQuantity === 0 ? (
          <div
            className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
            onClick={addQuantity}
          >
            + Add To Cart
          </div>
        ) : (
          <>
            <div className="w-1/2 flex">
              <div className="flex justify-center align-middle bg-transparent text-blue-700 font-semibold py-2 px-4 border border-grey-500 hover:rounded transition-all duration-100 ease-in">
                <svg
                  onClick={removeQuantity}
                  className="fill-current text-gray-600 w-3"
                  viewBox="0 0 448 512"
                >
                  <path d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
                </svg>
              </div>
              <div className="mx-2 text-center w-5 flex justify-center align-middle font-semibold py-2 px-4 ">
                {currentItemQuantity}
              </div>
              <div className="flex justify-center align-middle bg-transparent text-blue-700 font-semibold py-2 px-4 border border-grey-500 hover:rounded transition-all duration-100 ease-in">
                <svg
                  onClick={addQuantity}
                  className="fill-current text-gray-600 w-3"
                  viewBox="0 0 448 512"
                >
                  <path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
                </svg>
              </div>
            </div>
            <div
              onClick={removeItem}
              className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
            >
              Delete
            </div>
          </>
        )}
      </div>
    </Fragment>
  );
};

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<any>> {
  try {
    const { query } = context;
    const itemResult = await fetchitems({ filter: { _id: query.itemId } });
    return {
      props: { item: itemResult.data[0] },
    };
  } catch (err) {
    return { notFound: true };
  }
}
