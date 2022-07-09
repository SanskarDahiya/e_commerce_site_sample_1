import React, { memo } from "react";
import StoreSection from "./StoreSection";
import SingleItemSmall from "./SingleItemSmall";
import { useItemStore } from "@Store/itemlist";
import { ItemInterface } from "@Constants/Types";
import { useFetchItems } from "@Functions/fetchItems";
import { useEffect } from "react";

function ItemList({ items: initialItems }: { items: ItemInterface[] }) {
  const LoadMoreElement = useFetchItems(initialItems.length);
  const { items, replaceAll } = useItemStore((state) => {
    return {
      items: state.items.length ? state.items : initialItems,
      replaceAll: state.replaceAll,
    };
  });

  useEffect(() => {
    if (!items.length || initialItems[0]._id !== items[0]._id) {
      replaceAll(initialItems);
    }
  }, [initialItems, items, replaceAll]);

  return (
    <section className="bg-white py-8">
      <div className="container mx-auto flex items-center flex-wrap pt-4 pb-12">
        <StoreSection />
        {items.map((data, index) => (
          <SingleItemSmall item={data} key={data._id + index} index={index} />
        ))}
      </div>
      {LoadMoreElement}
    </section>
  );
}

export default memo(ItemList);
