import React from "react";
import { useAuthStore } from "@Store/auth";

function AdminToggleButton() {
  const { user, isEditEnable, toogleEdit } = useAuthStore((state) => ({
    user: state.user,
    isEditEnable: state.isEditEnable,
    toogleEdit: state.toogleEdit,
  }));
  const isAdmin = user?.isAdmin ? true : false;

  return isAdmin ? (
    <div className="cursor-pointer px-4" onClick={() => toogleEdit()}>
      Admin : {"" + !!isEditEnable}
    </div>
  ) : (
    <></>
  );
}

export default AdminToggleButton;
