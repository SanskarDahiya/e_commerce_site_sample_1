import "twin.macro";
import React, { Fragment } from "react";
import RegisterComponent from "../Components/Register";
import { GetServerSidePropsContext, NextApiRequest } from "next";
import { getAccessToken, verifyToken } from "../jwt";

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
  const token = getAccessToken(req as NextApiRequest);
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
