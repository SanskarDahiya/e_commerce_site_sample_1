import "twin.macro";
import type { NextPage } from "next";
import Carousal from "../Components/Carousal";
import ItemList from "../Components/ItemList";
import SideMenuCart from "../Components/SideCartSection/SideCart";
import { ItemInterface } from "../Constants/Types";
import mongo from "../Database/mongo";

interface MyProps {
  items: ItemInterface[];
}

const Home: NextPage<MyProps> = ({ items }) => {
  return (
    <div tw="relative">
      <Carousal />
      <ItemList items={items} />
      <SideMenuCart />
    </div>
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
