import tw from "twin.macro";
import Link from "next/link";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import FormInput from "../Helpers/FormInput";
import useAxios from "axios-hooks";
import Cookies from "js-cookie";
import Router from "next/router";

const Login = () => {
  const [{ data: result, loading: isLoading, error, response }, refetch] =
    useAxios(
      {
        url: "/api/user/login",
        method: "post",
      },
      {
        manual: true,
      }
    );

  useEffect(() => {
    if (result?.success) {
      const headers = response?.headers || {};
      const AccessToken = headers["x-access-token"];
      const RefreshToken = headers["x-refresh-token"];
      if (AccessToken) {
        Cookies.set("token", AccessToken, {
          expires: 0.041667, // 1 Hr; 1m = 0.0006
        });
      }
      if (RefreshToken) {
        // Cookies.set("r-token", RefreshToken);
      }
      Router.push("/");
    }
  }, [result, response?.headers]);
  const [data, setData] = useState({ email: "", password: "" });
  const { email, password } = data;

  const handleChange = (name: string) => {
    return (event: ChangeEvent<HTMLInputElement>) => {
      setData({ ...data, [name]: event.target.value });
    };
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    refetch({ data });
  };

  return (
    <div tw="container mx-auto px-4">
      <form
        tw="bg-white rounded-lg overflow-hidden shadow-2xl p-5  my-16 md:w-1/2 lg:w-1/3 mx-auto flex flex-col"
        onSubmit={onSubmit}
      >
        <h2 tw="font-bold text-3xl text-center mb-5 text-gray-800">Login</h2>
        <FormInput
          styles={email && [tw`bg-white`]}
          placeholder="Email"
          value={email}
          handleChange={handleChange("email")}
          type="email"
          disabled={isLoading}
          required={true}
        />
        <FormInput
          styles={password && [tw`bg-white`]}
          placeholder="Password"
          value={password}
          handleChange={handleChange("password")}
          type="password"
          disabled={isLoading}
          required={true}
          minLength={5}
        />
        {isLoading ? (
          <div id="loading" tw="self-center mb-3" />
        ) : (
          <button
            tw="font-bold rounded-md px-3 py-2 text-base cursor-pointer  focus:outline-none bg-gray-800 text-white w-full mb-3"
            type="submit"
          >
            Sign In
          </button>
        )}

        <div tw="flex justify-end w-full">
          <Link href={"/register"} passHref>
            <a tw="font-bold rounded-md px-3 py-2 text-base cursor-pointer focus:outline-none text-gray-800">
              Do you need a new account?
            </a>
          </Link>
        </div>
      </form>
    </div>
  );
};
export default Login;
