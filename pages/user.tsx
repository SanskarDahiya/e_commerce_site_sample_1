import React, { Fragment } from "react";
import { GetServerSidePropsContext, NextApiRequest, NextPage } from "next";
import Login from "@components/Login";
import { verifyToken } from "@auth/jwt";
import { getAccessTokenSSR } from "@auth/cookie";

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
