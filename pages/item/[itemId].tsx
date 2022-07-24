import { getAccessTokenSSR } from "@Auth/cookie";
import { verifyToken } from "@Auth/jwt";
import SingleItemSection from "@Components/SingleItemSection";
import mongo from "@Database/mongo";
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
    const cartDB = await mongo().getItemsDB();
    if (!cartDB) {
      throw new Error("No ItemsDB found");
    }

    const itemResult = await cartDB.findOne({
      _id: new ObjectId(itemId),
    });

    if (!itemResult) {
      throw new Error("No Items found");
    }

    return {
      props: { item: itemResult },
    };
  } catch (err) {
    return { notFound: true };
  }
}
