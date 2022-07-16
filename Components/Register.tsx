import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import Router from "next/router";
import useAxios from "axios-hooks";
import FormInput from "@Helpers/FormInput";
import { useToastStore } from "@Store/toast_store";
import FlipAnimation from "@Helpers/FlipAnimation";

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
    otp: "",
  });

  const { otp, name, email, password, confirmPasswrod } = data;

  const handleChange = (name: string) => {
    return (event: ChangeEvent<HTMLInputElement>) => {
      setData({ ...data, [name]: event.target.value });
    };
  };
  const onSendOtp = (cb: () => void) => {
    return async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const { password, confirmPasswrod } = data;
      if (!password || !confirmPasswrod || password !== confirmPasswrod) {
        setError("Invalid Password!! Both password must be same");
        return;
      }
      await refetch({ data });
      setSuccess("OTP send to given mail id");
      cb();
    };
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      await refetch({ data });
      Router.push("/user");
      setSuccess("User Registered!. Please login to continue", 3000);
    } catch (err) {}
  };

  return (
    <div className="container mx-auto px-4">
      <div className="bg-white rounded-lg overflow-hidden shadow-2xl p-5  my-16 md:w-1/2 lg:w-1/3 mx-auto flex flex-col">
        <h2 className="font-bold text-3xl text-center mb-5 text-gray-800">
          Register
        </h2>
        <FlipAnimation>
          {({ flipToIndex }) => {
            return [
              <form
                key={"front-side"}
                onSubmit={onSendOtp(() => {
                  flipToIndex(1);
                })}
              >
                <FormInput
                  placeholder="Name"
                  value={name}
                  handleChange={handleChange("name")}
                  type="text"
                  styles={name && "bg-white"}
                  required={true}
                  disabled={isLoading}
                />
                <FormInput
                  placeholder="Email"
                  value={email}
                  handleChange={handleChange("email")}
                  type="email"
                  styles={email && "bg-white"}
                  required={true}
                  disabled={isLoading}
                />
                <FormInput
                  placeholder="Password"
                  value={password}
                  handleChange={handleChange("password")}
                  type="password"
                  styles={password && "bg-white"}
                  required={true}
                  disabled={isLoading}
                />
                <FormInput
                  placeholder="Confirm Password"
                  value={confirmPasswrod}
                  handleChange={handleChange("confirmPasswrod")}
                  type="password"
                  styles={confirmPasswrod && "bg-white"}
                  required={true}
                  disabled={isLoading}
                />
                {isLoading ? (
                  <div className="cursor-disabled w-full flex justify-center">
                    <div id="loading" className="w-full self-center mb-3" />
                  </div>
                ) : (
                  <button
                    className="font-bold rounded-md px-3 py-2 text-base cursor-pointer  focus:outline-none bg-gray-800 text-white w-full mb-3"
                    type="submit"
                  >
                    Send OTP
                  </button>
                )}
                <div className="flex justify-end w-full">
                  <Link href={"/user"} passHref>
                    <a className="font-bold rounded-md px-3 py-2 text-base cursor-pointer focus:outline-none text-gray-800">
                      Already have an account?
                    </a>
                  </Link>
                </div>
              </form>,
              <div
                key={"back-side"}
                className="w-full h-full flex flex-col justify-evenly py-10"
              >
                <form onSubmit={onSubmit}>
                  <div>
                    <FormInput
                      placeholder="Enter OTP"
                      value={otp}
                      handleChange={handleChange("otp")}
                      type="text"
                      styles={otp && "bg-white"}
                      required={true}
                      disabled={isLoading}
                    />
                    {isLoading ? (
                      <div className="cursor-disabled w-full flex justify-center">
                        <div id="loading" className="w-full self-center mb-3" />
                      </div>
                    ) : (
                      <button
                        className="font-bold rounded-md px-3 py-2 text-base cursor-pointer  focus:outline-none bg-gray-800 text-white w-full mb-3"
                        type="submit"
                      >
                        Send OTP
                      </button>
                    )}
                  </div>
                  <button
                    className="font-bold rounded-md px-3 py-2 text-base cursor-pointer  focus:outline-none bg-gray-800 text-white w-full mb-3"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setData({ ...data, otp: "" });
                      flipToIndex(0);
                    }}
                  >
                    Back
                  </button>
                </form>
              </div>,
            ];
          }}
        </FlipAnimation>
      </div>
    </div>
  );
};
export default Register;
