import "twin.macro";
import React, { Fragment, useEffect, useState } from "react";
import Login from "../Components/Login";
import RegisterComponent from "../Components/Register";
// import { useRouter } from "next/router";

function Register() {
  return (
    <Fragment>
      <RegisterComponent />
    </Fragment>
  );
}
export default Register;
