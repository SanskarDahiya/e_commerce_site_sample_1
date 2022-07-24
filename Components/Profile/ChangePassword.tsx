import FormInput from "@Helpers/FormInput";
import React, { useState } from "react";

const ChangePassword = () => {
  const isLoading = false;
  const [data, setData] = useState({
    oldPassword: "",
    newPassword: "",
    newPasswordConfirm: "",
  });
  const { oldPassword, newPassword, newPasswordConfirm } = data;

  const handleBlur = (name: string) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      setData({ ...data, [name]: event.target.value });
    };
  };
  return (
    <div className="col-span-2 bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl mb-5">Change Password</h2>
      <div className="mb-4">
        <FormInput
          styles={oldPassword && "bg-white"}
          placeholder="Your Current password"
          value={oldPassword}
          handleBlur={handleBlur("oldPassword")}
          type="password"
          disabled={isLoading}
          required={true}
        />
      </div>
      <div className="mb-4">
        <FormInput
          styles={newPassword && "bg-white"}
          placeholder="New password"
          value={newPassword}
          handleBlur={handleBlur("newPassword")}
          type="password"
          disabled={isLoading}
          required={true}
        />
      </div>
      <div className="mb-4">
        <FormInput
          styles={newPasswordConfirm && "bg-white"}
          placeholder="Repeat new password"
          value={newPasswordConfirm}
          handleBlur={handleBlur("newPasswordConfirm")}
          type="password"
          disabled={isLoading}
          required={true}
        />
      </div>
      <div>
        <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
          Update
        </button>
      </div>
    </div>
  );
};

export default ChangePassword;
