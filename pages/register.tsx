import "twin.macro";
import React, { Fragment } from "react";
import RegisterComponent from "../Components/Register";
import { GetServerSidePropsContext, NextApiRequest } from "next";
import { verifyToken } from "../Auth/jwt";
import { getAccessTokenSSR } from "../Auth/cookie";

function Register() {
  return (
    <Fragment>
      <RegisterComponent />
    </Fragment>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const result = {};
  const { req } = context;
  const token = getAccessTokenSSR(req as NextApiRequest);
  const { result: profile } = verifyToken(token);
  if (profile?.email) {
    result.redirect = {
      destination: "/",
    };
  } else {
    result.props = {};
  }
  return result;
}
export default Register;
