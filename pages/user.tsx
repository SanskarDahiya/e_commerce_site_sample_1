import "twin.macro";
import React, { Fragment } from "react";
import Login from "../Components/Login";
import { GetServerSidePropsContext, NextApiRequest, NextPage } from "next";
import { verifyToken } from "../Auth/jwt";
import { getAccessTokenSSR } from "../Auth/cookie";

const User: NextPage = () => {
  return (
    <Fragment>
      <Login />
    </Fragment>
  );
};
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const token = getAccessTokenSSR(req as NextApiRequest);
  const { result: { _id: userId } = {} } = verifyToken(token);
  if (userId) {
    return { redirect: { destination: "/" } };
  }
  return {
    props: {},
  };
}
export default User;
