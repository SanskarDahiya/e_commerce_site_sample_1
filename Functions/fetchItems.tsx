import Loading from "@Helpers/Loading";
import { ItemInterface } from "@Constants/Types";
import axios from "@Helpers/Axios";
import { useItemStore } from "@Store/itemlist";
import { useRef, useState } from "react";
import useInfiniteScrollHook from "react-infinite-scroll-hook";

const ItemCache = [] as ItemInterface[];

interface DBParams {
  limit?: number;
  offset?: number;
  filter?: {
    [key: string]: any;
  };
}

interface DBResponse {
  data: any[];
  error: boolean;
  hasNext?: boolean;
}

const DEFAULT_LIMIT = 5;

export const fetchitems = async (params?: DBParams): Promise<DBResponse> => {
  try {
    const { limit = DEFAULT_LIMIT, offset = 0, filter } = params || {};
    const cacheItems = ItemCache.slice(offset, limit);
    if (cacheItems && cacheItems.length === limit) {
      return { data: cacheItems, hasNext: true, error: false };
    }
    const { data } = await axios({
      url: "/api/items/",
      method: "POST",
      data: { limit, offset, filter },
    });
    const items = data?.result || [];
    // ItemCache.splice(offset, 0, ...items);
    return { data: items, hasNext: items.length === limit, error: false };
  } catch (err) {
    return { data: [], error: true };
  }
};

export const useFetchItems = (initialLength?: number) => {
  const { items, addItems } = useItemStore((state) => ({
    items: state.items,
    addItems: state.addItems,
  }));
  const [loading, setLoading] = useState(false);
  const scrollerRef = useRef({
    hasNext: true,
    disabled: false,
    loading: false,
  });

  const onLoadMore = async () => {
    setLoading(true);
    try {
      if (scrollerRef.current.loading) {
        return;
      }
      scrollerRef.current.loading = true;
      const {
        data: newItems,
        hasNext,
        error,
      } = await fetchitems({
        offset: items.length || initialLength || 0,
      });
      scrollerRef.current.hasNext = !!hasNext;
      scrollerRef.current.disabled = !!error;
      scrollerRef.current.loading = false;
      addItems(newItems);
    } catch (err) {}
    setLoading(false);
  };

  const [ref] = useInfiniteScrollHook({
    loading: loading,
    hasNextPage: scrollerRef.current.hasNext,
    disabled: scrollerRef.current.disabled,
    onLoadMore: onLoadMore,
    rootMargin: "0px 0px 600px 0px",
  });

  if (loading || scrollerRef.current.hasNext) {
    return (
      <div ref={ref} className="relative flex mx-auto w-1/3 h-2">
        <Loading text="LOADING" />
      </div>
    );
  }
  return null;
};
