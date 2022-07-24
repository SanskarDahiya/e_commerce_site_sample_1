import React, { memo, useState } from "react";
import StoreSection from "@Components/StoreSection";
import ItemView from "@Components/HomeItemSection/ItemView";
import { useItemStore } from "@Store/itemlist";
import { ItemInterface } from "@Constants/Types";
import { useFetchItems } from "@Functions/fetchItems";
import { useEffect } from "react";
import { useFilterStore } from "@Store/filter_store";

function ItemList({ items: initialItems }: { items: ItemInterface[] }) {
  const [defaultElement, setDefaultElement] = useState(initialItems);
  const filterCount = useFilterStore((state) => state.filterCount);

  useEffect(() => {
    if (filterCount > 0) {
      replaceAll([]);
      setDefaultElement([]);
    } else {
      setDefaultElement(initialItems);
    }
  }, [filterCount]);
  const LoadMoreElement = useFetchItems(defaultElement.length);
  const { items, replaceAll } = useItemStore((state) => {
    return {
      items: state.items.length ? state.items : defaultElement,
      replaceAll: state.replaceAll,
    };
  });

  useEffect(() => {
    try {
      if (!items.length || defaultElement[0]._id !== items[0]._id) {
        replaceAll(defaultElement);
      }
    } catch (err) {}
  }, [defaultElement, items]);

  return (
    <section className="bg-white py-8">
      <div className="container mx-auto flex items-center flex-wrap pt-4 pb-12">
        <StoreSection />
        {items.map((data, index) => (
          <ItemView key={data._id} item={data} index={index} />
        ))}
      </div>
      {LoadMoreElement}
    </section>
  );
}

export default memo(ItemList);
