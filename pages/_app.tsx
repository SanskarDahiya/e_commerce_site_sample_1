import "@Styles/globals.css";
import { useEffect } from "react";
import type { AppProps } from "next/app";

import axios, { useAxiosInterceptior } from "@Helpers/Axios";
import ToastModal from "@Helpers/ToastModal";
import SideMenuCart from "@Components/SideCartSection/SideCart";
import Header from "@Components/Header";
import Footer from "@Components/Footer";
import { useAuthStore } from "@Store/auth";
import { useShoppingCart } from "@Store/shoppingCart";
import {
  CartInterface,
  ResponseInterface,
  UserInterface,
} from "@Constants/Types";

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
    cb({ error: "ERROR" });
  }
};

function MyApp({ Component, pageProps }: AppProps) {
  useAxiosInterceptior();

  const {
    setUser,
    accessToken,
    refreshToken,
    setAccessToken,
    setRefreshToken,
    setLoading,
  } = useAuthStore((state) => ({
    setUser: state.setUser,
    accessToken: state.accessToken,
    setAccessToken: state.setAccessToken,
    refreshToken: state.refreshToken,
    setRefreshToken: state.setRefreshToken,
    setLoading: state.setLoading,
  }));

  const setCartItems = useShoppingCart((s) => s.setCartItems);

  useEffect(() => {
    let mount = true;
    setLoading(true);
    if (refreshToken || accessToken) {
      validateUser((result: ResultInterface) => {
        if (!mount) return;
        if (result.error) {
          setRefreshToken(null);
          setAccessToken(null);
        } else {
          if (result?.user) {
            setUser(result.user);
          }
          if (result?.cart) {
            setCartItems(result.cart);
          }
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
    return () => {
      mount = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, refreshToken]);
  return (
    <>
      {/* <GlobalStyles /> */}
      <Header />
      <ToastModal />
      <Component {...pageProps} />
      <SideMenuCart />
      <Footer />
    </>
  );
}

export default MyApp;
