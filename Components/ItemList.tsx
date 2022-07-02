import "twin.macro";
import React from "react";
import StoreSection from "./StoreSection";
import SingleItemSmall from "./SingleItemSmall";
import AdminAddItem from "../Helpers/AdminAddItem";
import { useAuthStore } from "../Store/auth";

function ItemList({ items: itemResult }: { items: any[] }) {
  const { isEditEnable } = useAuthStore((state) => ({
    user: state.user || {},
    isEditEnable: state.isEditEnable,
  }));

  return (
    <section tw="bg-white py-8">
      <div tw="container mx-auto flex items-center flex-wrap pt-4 pb-12">
        <StoreSection />
        {itemResult.map((data, index) =>
          isEditEnable ? (
            <AdminAddItem data={data} key={data._id + index} />
          ) : (
            <SingleItemSmall data={data} key={data._id + index} />
          )
        )}
      </div>
    </section>
  );
}

export default ItemList;
