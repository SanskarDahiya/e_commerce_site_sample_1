import axios from "@Helpers/Axios";

export const updateItemInfo = async (id: string, changes: any) => {
  const result = await axios({
    url: "/api/database",
    method: "POST",
    headers: {
      ["x-custom-table"]: "items",
    },
    data: { id, changes },
  });
  return result;
};

export const updateCartInfo = async (id: string, changes: any) => {
  if (!id || !changes) {
    return;
  }
  await axios({
    url: "/api/database",
    method: "POST",
    headers: {
      ["x-custom-table"]: "user_carts",
    },
    data: { id, changes },
  });
};
