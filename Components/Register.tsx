import tw from "twin.macro";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import Router from "next/router";
import useAxios from "axios-hooks";
import FormInput from "@helpers/FormInput";
import { useToastStore } from "@store/toast_store";

const Register = () => {
  const { setSuccess, setError } = useToastStore((state) => ({
    setSuccess: state.setSuccess,
    setError: state.setError,
  }));
  const [{ data: result, loading: isLoading, error }, refetch] = useAxios(
    {
      url: "/api/user/register",
      method: "post",
    },
    {
      manual: true,
    }
  );
  useEffect(() => {
    if (error?.response?.data?.error) {
      setError(error?.response?.data?.error);
    }
    // eslint-disable-next-line
  }, [error?.response?.data]);

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPasswrod: "",
  });

  const { name, email, password, confirmPasswrod } = data;

  const handleChange = (name: string) => {
    return (event: ChangeEvent<HTMLInputElement>) => {
      setData({ ...data, [name]: event.target.value });
    };
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const result = await refetch({ data });
      const isSuccess = result.data.success;
      if (isSuccess) {
        Router.push("/user");
        setSuccess("User Registered!. Please login to continue", 3000);
      }
    } catch (err) {}
  };

  return (
    <div tw="container mx-auto px-4">
      <form
        tw="bg-white rounded-lg overflow-hidden shadow-2xl p-5  my-16 md:w-1/2 lg:w-1/3 mx-auto flex flex-col"
        onSubmit={onSubmit}
      >
        <h2 tw="font-bold text-3xl text-center mb-5 text-gray-800">Register</h2>
        <FormInput
          placeholder="Name"
          value={name}
          handleChange={handleChange("name")}
          type="text"
          styles={name && [tw`bg-white`]}
          required={true}
          disabled={isLoading}
        />
        <FormInput
          placeholder="Email"
          value={email}
          handleChange={handleChange("email")}
          type="email"
          styles={email && [tw`bg-white`]}
          required={true}
          disabled={isLoading}
        />
        <FormInput
          placeholder="Password"
          value={password}
          handleChange={handleChange("password")}
          type="password"
          styles={password && [tw`bg-white`]}
          required={true}
          disabled={isLoading}
        />
        {/* <FormInput
          placeholder="Confirm Password"
          value={confirmPasswrod}
          handleChange={handleChange("confirmPasswrod")}
          type="password"
          styles={confirmPasswrod && [tw`bg-white`]}
          required={true}
          disabled={isLoading}
        /> */}
        {isLoading ? (
          <div id="loading" tw="self-center mb-3" />
        ) : (
          <button
            tw="font-bold rounded-md px-3 py-2 text-base cursor-pointer  focus:outline-none bg-gray-800 text-white w-full mb-3"
            type="submit"
          >
            Sign Up
          </button>
        )}
        {/* {error?.response?.data && (
          <div>{JSON.stringify(error?.response?.data)}</div>
        )} */}
        <div tw="flex justify-end w-full">
          <Link href={"/user"} passHref>
            <a tw="font-bold rounded-md px-3 py-2 text-base cursor-pointer focus:outline-none text-gray-800">
              Already have an account?
            </a>
          </Link>
        </div>
      </form>
    </div>
  );
};
export default Register;
