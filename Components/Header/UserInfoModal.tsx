import React, { memo, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@Store/auth";
import Cookies from "js-cookie";
import Router from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faUser } from "@fortawesome/free-solid-svg-icons";
import { useToastStore } from "@Store/toast_store";
import { useShoppingCart } from "@Store/shoppingCart";

function UserInfoModal() {
  const { setInfo } = useToastStore((state) => ({
    setInfo: state.setInfo,
  }));
  const [isOpen, setIsOpen] = useState(false);
  const { user, setRefreshToken, setAccessToken, setUser } = useAuthStore();
  const emptyCart = useShoppingCart((s) => s.emptyCart);

  const handleProfileClick = (status: boolean | null) => {
    if (!user) {
      setIsOpen(false);
      return;
    }
    if (status === null) {
      setIsOpen((a) => !a);
    } else {
      setIsOpen(status);
    }
  };
  const handleLogout = () => {
    handleProfileClick(false);
    setRefreshToken(null);
    setAccessToken(null);
    setUser(undefined);
    emptyCart();
    Cookies.remove("token");
    Router.push("/");
    setInfo("Logout successful");
  };

  if (!user?.name) {
    return (
      <Link href={"/user"} passHref>
        <a className="inline-block no-underline hover:text-black relative">
          <svg
            className="fill-current hover:text-black pl-1"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <circle fill="none" cx="12" cy="7" r="3" />
            <path d="M12 2C9.243 2 7 4.243 7 7s2.243 5 5 5 5-2.243 5-5S14.757 2 12 2zM12 10c-1.654 0-3-1.346-3-3s1.346-3 3-3 3 1.346 3 3S13.654 10 12 10zM21 21v-1c0-3.859-3.141-7-7-7h-4c-3.86 0-7 3.141-7 7v1h2v-1c0-2.757 2.243-5 5-5h4c2.757 0 5 2.243 5 5v1H21z" />
          </svg>
        </a>
      </Link>
    );
  }

  return (
    <div
      className="relative inline-block text-left"
      onMouseEnter={() => {
        // handleProfileClick(true);
      }}
      onMouseLeave={() => {
        handleProfileClick(false);
      }}
    >
      <div>
        <button
          type="button"
          onClick={() => {
            Router.push("/user");
            handleProfileClick(null);
          }}
          className="flex items-center justify-between w-full rounded-md px-2 py-1 dark:text-gray-50 hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-500"
          id="options-menu"
        >
          {user.name}
          <svg
            className="fill-current hover:text-black pl-1"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <circle fill="none" cx="12" cy="7" r="3" />
            <path d="M12 2C9.243 2 7 4.243 7 7s2.243 5 5 5 5-2.243 5-5S14.757 2 12 2zM12 10c-1.654 0-3-1.346-3-3s1.346-3 3-3 3 1.346 3 3S13.654 10 12 10zM21 21v-1c0-3.859-3.141-7-7-7h-4c-3.86 0-7 3.141-7 7v1h2v-1c0-2.757 2.243-5 5-5h4c2.757 0 5 2.243 5 5v1H21z" />
          </svg>
        </button>
      </div>

      <div
        className={
          "transition-all duration-200 ease-linear origin-top-right absolute right-0 py-2 w-56 rounded-md " +
          (isOpen
            ? "bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-[1] overflow-hidden "
            : "") +
          (isOpen ? "h-28" : "h-0")
        }
        onMouseEnter={() => {
          // handleProfileClick(true);
        }}
        onMouseLeave={() => {
          handleProfileClick(false);
        }}
      >
        {isOpen && (
          <div
            className="py-1 divide-y divide-gray-100"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <div className="cursor-pointer">
              <Link href="/profile">
                <div className="flex items-center px-4 py-2  text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white dark:hover:bg-gray-600">
                  <FontAwesomeIcon
                    icon={faUser}
                    style={{ marginRight: "10px" }}
                  />

                  <span className="flex flex-col">
                    <span>Profile</span>
                  </span>
                </div>
              </Link>
            </div>

            <div className="cursor-pointer">
              <button onClick={handleLogout} className="w-full">
                <div className="flex items-center px-4 py-2  text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white dark:hover:bg-gray-600">
                  <FontAwesomeIcon
                    icon={faSignOutAlt}
                    style={{ marginRight: "10px" }}
                  />

                  <span className="flex flex-col">
                    <span>LogOut</span>
                  </span>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default memo(UserInfoModal);
