import ChangePassword from "@Components/Profile/ChangePassword";
import React from "react";

const Profile = () => {
  return (
    <>
      <div className="container lg:w-2/3 xl:w-2/3 mx-auto pt-2 pb-5">
        <div className="grid grid-cols-1 sm:grid-cols-5 items-start gap-6">
          <div className="col-span-3 bg-white p-4 rounded-lg shadow">
            {/*  Profile Details --> */}
            <div className="mb-6">
              <h2 className="text-xl mb-5">Your Profile</h2>
              <div className="mb-4">
                <input
                  placeholder="Your Name"
                  type="text"
                  name="name"
                  className="border-gray-300 focus:border-purple-500 focus:outline-none focus:ring-purple-500 rounded-md w-full"
                />
              </div>
              <div className="mb-4">
                <input
                  placeholder="Your Email"
                  type="email"
                  name="email"
                  className="border-gray-300 focus:border-purple-500 focus:outline-none focus:ring-purple-500 rounded-md w-full"
                />
              </div>
              <div className="mb-4">
                <input
                  placeholder="Your Phone"
                  type="text"
                  name="phone"
                  className="border-gray-300 focus:border-purple-500 focus:outline-none focus:ring-purple-500 rounded-md w-full"
                />
              </div>
            </div>
            {/* / Profile Details --> */}

            {/*  Billing Address --> */}
            <div className="mb-6">
              <h2 className="text-xl mb-5">Billing Address</h2>
              <div className="flex gap-3">
                <div className="mb-4 flex-1">
                  <input
                    placeholder="Address 1"
                    type="text"
                    name="billing_address_1"
                    className="border-gray-300 focus:border-purple-500 focus:outline-none focus:ring-purple-500 rounded-md w-full"
                  />
                </div>
                <div className="mb-4 flex-1">
                  <input
                    placeholder="Address 2"
                    type="text"
                    name="billing_address_2"
                    className="border-gray-300 focus:border-purple-500 focus:outline-none focus:ring-purple-500 rounded-md w-full"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <div className="mb-4 flex-1">
                  <input
                    placeholder="City"
                    type="text"
                    name="billing_city"
                    className="border-gray-300 focus:border-purple-500 focus:outline-none focus:ring-purple-500 rounded-md w-full"
                  />
                </div>
                <div className="mb-4 flex-1">
                  <input
                    placeholder="State"
                    type="text"
                    name="billing_state"
                    className="border-gray-300 focus:border-purple-500 focus:outline-none focus:ring-purple-500 rounded-md w-full"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <div className="mb-4 flex-1">
                  <select
                    placeholder="Country"
                    type="text"
                    name="billing_country"
                    className="border-gray-300 focus:border-purple-500 focus:outline-none focus:ring-purple-500 rounded-md w-full"
                  >
                    <option value="">Country</option>
                    <option value="ge">Georgia</option>
                    <option value="de">Germany</option>
                    <option value="in">India</option>
                    <option value="us">United Kingdom</option>
                    <option value="uk">United States</option>
                  </select>
                </div>
                <div className="mb-4 flex-1">
                  <input
                    placeholder="Zipcode"
                    type="text"
                    name="billing_zipcode"
                    className="border-gray-300 focus:border-purple-500 focus:outline-none focus:ring-purple-500 rounded-md w-full"
                  />
                </div>
              </div>
            </div>
            {/* / Billing Address --> */}

            {/*  Shipping Address --> */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl">Shipping Address</h2>
                <div className="flex items-center">
                  <input
                    id="sameAsBillingAddress"
                    type="checkbox"
                    className="mr-3 rounded border-gray-300 text-purple-500 focus:ring-purple-500"
                  />
                  <label htmlFor="sameAsBillingAddress">Same as Billing</label>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="mb-4 flex-1">
                  <input
                    placeholder="Address 1"
                    type="text"
                    name="shipping_address_1"
                    className="border-gray-300 focus:border-purple-500 focus:outline-none focus:ring-purple-500 rounded-md w-full"
                  />
                </div>
                <div className="mb-4 flex-1">
                  <input
                    placeholder="Address 2"
                    type="text"
                    name="shipping_address_2"
                    className="border-gray-300 focus:border-purple-500 focus:outline-none focus:ring-purple-500 rounded-md w-full"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <div className="mb-4 flex-1">
                  <input
                    placeholder="City"
                    type="text"
                    name="shipping_city"
                    className="border-gray-300 focus:border-purple-500 focus:outline-none focus:ring-purple-500 rounded-md w-full"
                  />
                </div>
                <div className="mb-4 flex-1">
                  <input
                    placeholder="State"
                    type="text"
                    name="shipping_state"
                    className="border-gray-300 focus:border-purple-500 focus:outline-none focus:ring-purple-500 rounded-md w-full"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <div className="mb-4 flex-1">
                  <select
                    placeholder="Country"
                    type="text"
                    name="shipping_country"
                    className="border-gray-300 focus:border-purple-500 focus:outline-none focus:ring-purple-500 rounded-md w-full"
                  >
                    <option value="">Country</option>
                    <option value="ge">Georgia</option>
                    <option value="de">Germany</option>
                    <option value="in">India</option>
                    <option value="us">United Kingdom</option>
                    <option value="uk">United States</option>
                  </select>
                </div>
                <div className="mb-4 flex-1">
                  <input
                    placeholder="Zipcode"
                    type="text"
                    name="shipping_zipcode"
                    className="border-gray-300 focus:border-purple-500 focus:outline-none focus:ring-purple-500 rounded-md w-full"
                  />
                </div>
              </div>
            </div>
            {/* / Shipping Address --> */}

            <button className="btn-primary bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 w-full">
              Update
            </button>
          </div>
          <ChangePassword />
        </div>
      </div>
    </>
  );
};

export default Profile;
