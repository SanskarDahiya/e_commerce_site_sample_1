import type { GetServerSidePropsContext, NextPage } from "next";
import { Fragment } from "react";
import Carousal from "../Components/Carousal";
import ItemList from "../Components/ItemList";

const Home: NextPage = () => {
  return (
    <Fragment>
      <Carousal />
      <ItemList />
    </Fragment>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return { props: {} };
}

export default Home;
