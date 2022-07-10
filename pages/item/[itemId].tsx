import { ItemInterface } from "@Constants/Types";
import { fetchitems } from "@Functions/fetchItems";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import React from "react";

interface SingleItemProps {
  data: ItemInterface;
}

function SingleItem({ data }: SingleItemProps) {
  return (
    <div>
      SingleItem
      <br />
      {JSON.stringify(data)};
    </div>
  );
}

export default SingleItem;

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<any>> {
  try {
    const { query } = context;
    const itemResult = await fetchitems({ filter: { _id: query.itemId } });
    return {
      props: { data: itemResult },
    };
  } catch (err) {
    return { notFound: true };
  }
}
