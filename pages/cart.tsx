import { ObjectId } from "mongodb";
import { GetServerSidePropsContext, NextApiRequest } from "next";
import React from "react";
import { getAccessTokenSSR } from "@auth/cookie";
import { verifyToken } from "@auth/jwt";
import SingleCartItem from "@components/SingleCartItem";
import { CartInterface } from "@constants/Types";
import mongo from "@database/mongo";

interface MyProps {
  cartData: CartInterface;
}

function Cart({ cartData }: MyProps) {
  return (
    <div>
      {cartData.items.map((resourceId, index) => {
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
  const { result: { _id: userId } = {} } = verifyToken(token);
  if (!userId) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }
  const cartDB = await mongo().getCartDB();
  const cartData = await cartDB?.findOne({ _id: new ObjectId(userId) });
  return {
    props: {
      cartData: {
        ...cartData,
        _id: cartData?._id.toString(),
      },
    },
  };
}
