import tw from "twin.macro";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useShoppingCart } from "../Store/shoppingCart";
import { useItemStore } from "../Store/itemlist";
("react");

function AdminAddItem({ data }: any) {
  const { items, replaceAll, removeItem } = useItemStore();

  const [item, setItem] = useState(data);
  const { id, imageUrl, price, title, favourate } = item || {};

  const addQuantity = (e: any) => {
    e.preventDefault();
  };
  const removeQuantity = (e: any) => {
    e.preventDefault();
  };
  const removeItem_ = (e: any) => {
    e.preventDefault();
    removeItem(item);
  };

  return (
    <div
      className="itemList1212"
      tw="w-full md:w-1/3 xl:w-1/4 p-6 flex flex-col"
    >
      <Link href={"/items/" + id} passHref>
        <a>
          <div tw="hover:flex-grow hover:shadow-lg">
            {imageUrl && (
              <Image
                src={imageUrl}
                alt="Image-Section"
                quality={80}
                height={400}
                width={400}
              />
            )}
          </div>

          <div tw="pt-3 flex items-center justify-between">
            <p>{title}</p>

            <div onClick={removeItem_}>Delete</div>
          </div>
          <div tw="flex items-center justify-between">
            <p tw="pt-1 text-gray-900">{price}</p>
            <div onClick={addQuantity}>+ Add To Cart</div>
          </div>
        </a>
      </Link>
    </div>
  );
}

export default AdminAddItem;
