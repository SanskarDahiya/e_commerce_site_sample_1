import "twin.macro";
import type {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextPage,
} from "next";
import Carousal from "@components/Carousal";
import ItemList from "@components/ItemList";
import SideMenuCart from "@components/SideCartSection/SideCart";
import { ItemInterface } from "@constants/Types";
import mongo from "@database/mongo";

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

export async function getServerSideProps(): Promise<
  GetServerSidePropsResult<any>
> {
  const itemDB = await mongo().getItemsDB();
  const items = (await itemDB?.find().toArray())?.map((data) => {
    return { ...data, _id: data._id.toString() };
  });

  return { props: { items } };
}

export default Home;
