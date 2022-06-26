import "../styles/globals.css";
import type { AppProps } from "next/app";
import { GlobalStyles } from "twin.macro";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { useEffect } from "react";
import { useAuthStore } from "../Store/auth";
import axios, { useAxiosInterceptior } from "../Helpers/Axios";

const validateUser = async (cb) => {
  try {
    const result = await axios({ url: "/api/user", method: "POST" });
    cb(result);
  } catch (err) {
    console.log("🚀 ~ file: _app.tsx ~ line 12 ~ validateUser ~ err", err);
  }
};

function MyApp({ Component, pageProps }: AppProps) {
  useAxiosInterceptior();

  const { setUser, accessToken, refreshToken } = useAuthStore((state) => ({
    setUser: state.setUser,
    accessToken: state.accessToken,
    refreshToken: state.refreshToken,
  }));

  useEffect(() => {
    let mount = true;
    if (refreshToken || accessToken) {
      validateUser((user: any) => {
        if (!mount) return;
        if (user) {
          setUser(user);
        }
      });
    }
    return () => {
      mount = false;
    };
  }, [accessToken, refreshToken]);
  return (
    <>
      <GlobalStyles />
      <Header />
      <Component {...pageProps} />
      <Footer />
    </>
  );
}

export default MyApp;
