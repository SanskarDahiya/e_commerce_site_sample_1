import React, { Fragment } from "react";
import RegisterComponent from "@components/Register";
import { GetServerSidePropsContext, NextApiRequest, NextPage } from "next";
import { verifyToken } from "@auth/jwt";
import { getAccessTokenSSR } from "@auth/cookie";

const Register: NextPage = () => {
  return (
    <Fragment>
      <RegisterComponent />
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
export default Register;
