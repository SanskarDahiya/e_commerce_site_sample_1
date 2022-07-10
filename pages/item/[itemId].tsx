import { fetchitems } from "@Functions/fetchItems";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import React from "react";

function SingleItem({ data }) {
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
