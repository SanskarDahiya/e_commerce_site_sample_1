import React, { memo, useEffect } from "react";
import StoreSection from "./StoreSection";
import SingleItemSmall from "./SingleItemSmall";
import { useItemStore } from "@store/itemlist";
import { ItemInterface } from "@constants/Types";

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
    <section className="bg-white py-8">
      <div className="container mx-auto flex items-center flex-wrap pt-4 pb-12">
        <StoreSection />
        {items.map((data, index) => (
          <SingleItemSmall item={data} key={data._id + index} index={index} />
        ))}
      </div>
    </section>
  );
}

export default memo(ItemList);
