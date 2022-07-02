import type { GetServerSidePropsContext, NextPage } from "next";
import { Fragment } from "react";
import Carousal from "../Components/Carousal";
import ItemList from "../Components/ItemList";
import mongo from "../Database/mongo";

const Home: NextPage = ({ itemResult }: any) => {
  return (
    <Fragment>
      <Carousal />
      <ItemList items={itemResult} />
    </Fragment>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const db = await mongo().getDatabase();
  const itemResult = (await db?.collection("items").find().toArray())?.map(
    (item) => {
      return { ...item, _id: item._id.toString() };
    }
  );

  return {
    props: {
      itemResult,
    },
  };
}

export default Home;
