import SingleItemSection from "@Components/SingleItemSection";
import { fetchitems } from "@Functions/fetchItems";
import { ObjectId } from "mongodb";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

export default SingleItemSection;

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<any>> {
  try {
    const { query } = context;
    if (query.itemId === "new-item") {
      const _id = new ObjectId();
      return {
        props: {
          item: {
            _id: _id.toString(),
          },
          isNewItem: true,
        },
      };
    }
    const itemResult = await fetchitems({ filter: { _id: query.itemId } });
    return {
      props: { item: itemResult.data[0] || { _id: query.itemId } },
    };
  } catch (err) {
    return { notFound: true };
  }
}
