import Link from "next/link";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import useAxios from "axios-hooks";
import Router from "next/router";
import FormInput from "@helpers/FormInput";
import { useAuthStore } from "@store/auth";
import { useToastStore } from "@store/toast_store";

const Login = () => {
  const { setSuccess, setError } = useToastStore((state) => ({
    setSuccess: state.setSuccess,
    setError: state.setError,
  }));

  const { setRefreshToken, setAccessToken } = useAuthStore((state) => ({
    setRefreshToken: state.setRefreshToken,
    setAccessToken: state.setAccessToken,
  }));

  const [{ data: result, loading: isLoading, error, response }, refetch] =
    useAxios({ url: "/api/user/login", method: "post" }, { manual: true });

  useEffect(() => {
    if (error?.response?.data?.error) {
      setError(error?.response?.data?.error);
    }
    // eslint-disable-next-line
  }, [error?.response?.data]);

  useEffect(() => {
    if (result?.success) {
      const headers = response?.headers || {};
      const AccessToken = headers["x-access-token"];
      const RefreshToken = headers["x-refresh-token"];

      setAccessToken(AccessToken);
      setRefreshToken(RefreshToken);

      Router.push("/");
      setSuccess("Login successful!");
    }
    // eslint-disable-next-line
  }, [result?.success, response?.headers]);

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
    <div className="container mx-auto px-4">
      <form
        className="bg-white rounded-lg overflow-hidden shadow-2xl p-5  my-16 md:w-1/2 lg:w-1/3 mx-auto flex flex-col"
        onSubmit={onSubmit}
      >
        <h2 className="font-bold text-3xl text-center mb-5 text-gray-800">
          Login
        </h2>
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
          <div id="loading" className="self-center mb-3" />
        ) : (
          <button
            className="font-bold rounded-md px-3 py-2 text-base cursor-pointer  focus:outline-none bg-gray-800 text-white w-full mb-3"
            type="submit"
          >
            Sign In
          </button>
        )}

        {/* {error?.response?.data && (
          <div>{JSON.stringify(error?.response?.data)}</div>
        )} */}

        <div className="flex justify-end w-full">
          <Link href={"/register"} passHref>
            <a className="font-bold rounded-md px-3 py-2 text-base cursor-pointer focus:outline-none text-gray-800">
              Do you need a new account?
            </a>
          </Link>
        </div>
      </form>
    </div>
  );
};
export default Login;
