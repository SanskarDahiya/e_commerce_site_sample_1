import { ObjectId } from "mongodb";
import { GetServerSidePropsContext, NextApiRequest } from "next";
import React from "react";
import { getAccessTokenSSR } from "@Auth/cookie";
import { verifyToken } from "@Auth/jwt";
import SingleCartItem from "@Components/SingleCartItem";
import { CartInterface } from "@Constants/Types";
import mongo from "@Database/mongo";

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
