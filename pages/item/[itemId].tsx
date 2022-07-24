import { getAccessTokenSSR } from "@Auth/cookie";
import { verifyToken } from "@Auth/jwt";
import SingleItemSection from "@Components/SingleItemSection";
import { fetchitems } from "@Functions/fetchItems";
import { ObjectId } from "mongodb";
import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextApiRequest,
} from "next";

export default SingleItemSection;

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<any>> {
  try {
    const { query } = context;

    if (!query.itemId) {
      throw new Error("Item Id Missing");
    }
    const itemId = query.itemId as string;
    if (itemId === "new-item") {
      try {
        const { req } = context;
        const token = getAccessTokenSSR(req as NextApiRequest);
        const { result: { isAdmin } = {} } = verifyToken(token);
        if (!isAdmin) {
          throw new Error("Non-Admin User Found");
        }
        return {
          props: {
            item: { _id: new ObjectId().toString() },
            isNewItem: true,
          },
        };
      } catch (err) {
        return {
          redirect: {
            destination: "/",
            permanent: true,
          },
        };
      }
    }
    const itemResult = await fetchitems({ filter: { _id: itemId } });

    if (!itemResult.data.length) {
      throw new Error("No Items found");
    }

    return {
      props: { item: itemResult.data[0] },
    };
  } catch (err) {
    return { notFound: true };
  }
}
