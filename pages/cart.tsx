import { ObjectId } from "mongodb";
import { GetServerSidePropsContext, NextApiRequest } from "next";
import React from "react";
import { getAccessTokenSSR } from "../Auth/cookie";
import { verifyToken } from "../Auth/jwt";
import SingleCartItem from "../Components/SingleCartItem";
import mongo from "../Database/mongo";

function Cart({ cartData }: any) {
  return (
    <div>
      {cartData.items.map((resourceId: any, index: number) => {
        return (
          <SingleCartItem
            key={index}
            data={{ ...cartData[resourceId], _id: resourceId }}
          />
        );
      })}
    </div>
  );
}

export default Cart;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const token = getAccessTokenSSR(req as NextApiRequest);
  const { result: { id: userId = null } = {} } = verifyToken(token) as any;

  if (!userId) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }

  const db = await mongo().getDatabase();
  const cartData = await db
    ?.collection("user_cart")
    .findOne({ _id: new ObjectId(userId) });

  return {
    props: {
      cartData: {
        ...cartData,
        _id: cartData?._id.toString(),
      },
    },
  };
}
