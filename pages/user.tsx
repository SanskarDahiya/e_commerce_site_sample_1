import "twin.macro";
import React, { Fragment } from "react";
import Login from "../Components/Login";
import jwt from "jsonwebtoken";
import { GetServerSidePropsContext } from "next";

const SECRET_KEY = "THIS IS CUSTOM KEY";

/*
 * @params {jwtToken} extracted from cookies
 * @return {object} object of extracted token
 */
export function verifyToken(jwtToken: string) {
  try {
    return jwt.verify(jwtToken, SECRET_KEY);
  } catch (e) {
    // console.log("e:", e.message);
    return null;
  }
}

/*
 * @params {request} extracted from request response
 * @return {object} object of parse jwt cookie decode object
 */
export function getAppCookies(req) {
  const parsedItems = {} as {
    [key: string]: string;
  };
  if (req.headers.cookie) {
    const cookiesItems = req.headers.cookie.split("; ");
    cookiesItems.forEach((cookies: string) => {
      const parsedItem = cookies.split("=");
      parsedItems[parsedItem[0]] = decodeURI(parsedItem[1]);
    });
  }
  return parsedItems;
}

function User() {
  return (
    <Fragment>
      <Login />
    </Fragment>
  );
}
interface IProp {}
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const result = {};
  const { req } = context;
  const { token } = getAppCookies(req);
  const profile = token ? verifyToken(token.split(" ")[1]) : "";
  if (profile?.email) {
    result.redirect = {
      destination: "/",
    };
  } else {
    result.props = {
      profile,
    };
  }
  return result;
}
export default User;
