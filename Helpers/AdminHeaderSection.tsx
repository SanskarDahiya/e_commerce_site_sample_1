import "twin.macro";
import React from "react";
import { useAuthStore } from "../Store/auth";

function AdminHeaderSection() {
  const {
    user: { isAdmin },
    isEditEnable,
    toogleEdit,
  } = useAuthStore((state) => ({
    user: state.user || {},
    isEditEnable: state.isEditEnable,
    toogleEdit: state.toogleEdit,
  }));

  return isAdmin ? (
    <div tw="cursor-pointer px-4" onClick={() => toogleEdit()}>
      Admin : {"" + !!isEditEnable}
    </div>
  ) : (
    <></>
  );
}

export default AdminHeaderSection;
