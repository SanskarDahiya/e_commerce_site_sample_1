import "twin.macro";
import React, { memo, useEffect } from "react";
import { useItemStore } from "../Store/itemlist";
import StoreSection from "./StoreSection";
import SingleItemSmall from "./SingleItemSmall";
import { ItemInterface } from "../Constants/Types";

function ItemList({ items: itemResult }: { items: ItemInterface[] }) {
  const { items, replaceAll } = useItemStore((state) => ({
    items: state.items,
    replaceAll: state.replaceAll,
  }));
  useEffect(() => {
    replaceAll(itemResult);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemResult]);
  return (
    <section tw="bg-white py-8">
      <div tw="container mx-auto flex items-center flex-wrap pt-4 pb-12">
        <StoreSection />
        {items.map((data, index) => (
          <SingleItemSmall item={data} key={data._id + index} index={index} />
        ))}
      </div>
    </section>
  );
}

export default memo(ItemList);
