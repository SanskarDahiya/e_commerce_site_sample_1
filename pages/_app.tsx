import "../styles/globals.css";
import type { AppProps } from "next/app";
import { GlobalStyles } from "twin.macro";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { useEffect } from "react";
import { getUserFromCookie } from "../Auth/cookie";
import { useAuthStore } from "../Store/auth";
import axios from "../Helpers/Axios";

const validateUser = async (cb) => {
  try {
    cb();
    // const result = await axios({ url: "/api/tokens/validate", method: "POST" });
  } catch (err) {
    console.log("🚀 ~ file: _app.tsx ~ line 12 ~ validateUser ~ err", err);
  }
};

function MyApp({ Component, pageProps }: AppProps) {
  const { setUser, accessToken } = useAuthStore((state) => ({
    setUser: state.setUser,
    accessToken: state.accessToken,
  }));
  useEffect(() => {
    let mount = true;
    validateUser(() => {
      if (!mount) return;
      const user = getUserFromCookie();
      if (user?.result) {
        setUser(user?.result);
      }
    });
    return () => {
      mount = false;
    };
  }, [accessToken]);
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
