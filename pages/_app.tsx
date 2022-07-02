import "../styles/globals.css";
import type { AppProps } from "next/app";
import { GlobalStyles } from "twin.macro";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { useEffect } from "react";
import { useAuthStore } from "../Store/auth";
import axios, { useAxiosInterceptior } from "../Helpers/Axios";
import { useShoppingCart } from "../Store/shoppingCart";
import {
  CartInterface,
  ResponseInterface,
  UserInterface,
} from "../Constants/Types";

interface ResultInterface extends ResponseInterface {
  user?: UserInterface;
  cart?: CartInterface;
}

const validateUser = async (cb: (user: any) => any) => {
  try {
    const { data: { result } = {} } = await axios({
      url: "/api/user",
      method: "POST",
    });

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

  const setCartItems = useShoppingCart((s) => s.setCartItems);

  useEffect(() => {
    let mount = true;
    if (refreshToken || accessToken) {
      validateUser((result: ResultInterface) => {
        if (!mount) return;
        if (result?.user) {
          setUser(result.user);
        }
        if (result?.cart) {
          setCartItems(result.cart);
        }
      });
    }
    return () => {
      mount = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
