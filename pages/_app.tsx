import "../styles/globals.css";
import type { AppProps } from "next/app";
import { GlobalStyles } from "twin.macro";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

function MyApp({ Component, pageProps }: AppProps) {
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
