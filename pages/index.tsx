import type { GetServerSidePropsContext, NextPage } from "next";
import { Fragment } from "react";
import Carousal from "../Components/Carousal";
import ItemList from "../Components/ItemList";
import { ItemInterface } from "../Constants/Types";
import mongo from "../Database/mongo";

interface MyProps {
  items: ItemInterface[];
}

const Home: NextPage<MyProps> = ({ items }) => {
  return (
    <Fragment>
      <Carousal />
      <ItemList items={items} />
    </Fragment>
  );
};

export async function getServerSideProps() {
  const itemDB = await mongo().getItemsDB();
  const items = (await itemDB?.find().toArray())?.map((data) => {
    return { ...data, _id: data._id.toString() };
  });

  return { props: { items } };
}

export default Home;
