import axios from "@Helpers/Axios";
import { useItemStore } from "@Store/itemlist";
import { useRef, useState } from "react";
import useInfiniteScrollHook from "react-infinite-scroll-hook";

interface DBParams {
  limit?: number;
  offset?: number;
}

interface DBResponse {
  data?: any;
  error?: any;
  hasNext?: boolean;
}

const DEFAULT_LIMIT = 5;

export const fetchitems = async (params?: DBParams): Promise<DBResponse> => {
  try {
    const { limit = DEFAULT_LIMIT, offset = 0 } = params || {};
    const { data } = await axios({
      url: "/api/items/",
      method: "POST",
      data: { limit, offset },
    });
    const items = data?.result || [];
    return { data: items, hasNext: items.length === limit };
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
  const scrollerRef = useRef({ hasNext: true, disabled: false });

  const onLoadMore = async () => {
    setLoading(true);
    try {
      const {
        data: newItems,
        hasNext,
        error,
      } = await fetchitems({
        offset: items.length || initialLength || 0,
      });
      scrollerRef.current.hasNext = !!hasNext;
      scrollerRef.current.disabled = !!error;
      addItems(newItems);
    } catch (err) {}
    setLoading(false);
  };

  const [ref] = useInfiniteScrollHook({
    loading: loading,
    hasNextPage: scrollerRef.current.hasNext,
    disabled: scrollerRef.current.disabled,
    onLoadMore: onLoadMore,
    rootMargin: "0px 0px 400px 0px",
  });

  if (loading || scrollerRef.current.hasNext) {
    return (
      <div
        ref={ref}
        style={{
          border: "1px solid black",
        }}
      >
        Loading
      </div>
    );
  }
  return null;
};
