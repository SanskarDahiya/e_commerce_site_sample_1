import type {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextApiRequest,
  NextPage,
} from "next";
import Carousal from "@Components/Carousal";
import ItemList from "@Components/ItemList";
import SideMenuCart from "@Components/SideCartSection/SideCart";
import { ItemInterface } from "@Constants/Types";
import { getAccessTokenSSR } from "@Auth/cookie";
import { useEffect } from "react";
import { useAuthStore } from "@Store/auth";
import { fetchitems } from "@Functions/fetchItems";

interface MyProps {
  items: ItemInterface[];
  access_token: string;
}

const Home: NextPage<MyProps> = ({ items, access_token }) => {
  const { accessToken, setAccessToken } = useAuthStore((state) => ({
    accessToken: state.accessToken,
    setAccessToken: state.setAccessToken,
  }));

  useEffect(() => {
    if (accessToken !== access_token) {
      // FALLBACK, If user unable to sign in
      // setAccessToken(access_token);
    }
  }, [access_token, accessToken, setAccessToken]);
  return (
    <div className="relative">
      <Carousal />
      <ItemList items={items} />
      <SideMenuCart />
    </div>
  );
};

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<any>> {
  const { req } = context;
  const token = getAccessTokenSSR(req as NextApiRequest);
  const { data = [] } = await fetchitems();
  return { props: { items: data, access_token: token } };
}

export default Home;
