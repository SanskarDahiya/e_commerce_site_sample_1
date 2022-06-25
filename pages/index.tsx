import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { Fragment } from "react";
import Carousal from "../Components/Carousal";
import ItemList from "../Components/ItemList";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <Fragment>
      <Carousal />
      <ItemList />
    </Fragment>
  );
};

export default Home;
