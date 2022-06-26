import "twin.macro";
import React, { Fragment } from "react";
import Login from "../Components/Login";
import { GetServerSidePropsContext, NextApiRequest } from "next";
import { verifyToken } from "../Auth/jwt";
import { getAccessTokenSSR } from "../Auth/cookie";

function User() {
  return (
    <Fragment>
      <Login />
    </Fragment>
  );
}
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const result = {} as any;
  const { req } = context;
  const token = getAccessTokenSSR(req as NextApiRequest);
  const { result: profile } = verifyToken(token) as { result: any };
  if (profile?.id) {
    result.redirect = {
      destination: "/",
    };
  } else {
    result.props = {};
  }
  return result;
}
export default User;
