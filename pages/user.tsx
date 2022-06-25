import "twin.macro";
import React, { Fragment } from "react";
import Login from "../Components/Login";
import { GetServerSidePropsContext, NextApiRequest } from "next";
import { getAccessToken, verifyToken } from "../jwt";

function User() {
  return (
    <Fragment>
      <Login />
    </Fragment>
  );
}
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const result = {};
  const { req } = context;
  const token = getAccessToken(req as NextApiRequest);
  const { result: profile } = verifyToken(token);
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
