import "twin.macro";
import React, { memo, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@store/auth";
import Cookies from "js-cookie";
import Router from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faUser } from "@fortawesome/free-solid-svg-icons";
import { useToastStore } from "@store/toast_store";

function UserHeaderSection() {
  const { setInfo } = useToastStore((state) => ({
    setInfo: state.setInfo,
  }));
  const [isOpen, setIsOpen] = useState(false);
  const { user, setRefreshToken, setAccessToken, setUser } = useAuthStore();

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
    Cookies.remove("token");
    Router.push("/");
    setInfo("Logout successful");
  };

  if (!user?.name) {
    return (
      <Link href={"/user"} passHref>
        <a tw="inline-block no-underline hover:text-black relative">
          <svg
            tw="fill-current hover:text-black pl-1"
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
      tw="relative inline-block text-left"
      onMouseEnter={(e: any) => {
        e.preventDefault();
        // handleProfileClick(true);
      }}
    >
      <div>
        <button
          type="button"
          onClick={() => {
            Router.push("/user");
            handleProfileClick(null);
          }}
          tw="flex items-center justify-between w-full rounded-md px-2 py-1 dark:text-gray-50 hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-500"
          id="options-menu"
        >
          {user.name}
          <svg
            tw="fill-current hover:text-black pl-1"
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

      {isOpen && (
        <div
          tw="origin-top-right absolute right-0 mt-2 w-56 rounded-md bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10"
          onMouseEnter={(e: any) => {
            e.preventDefault();
            handleProfileClick(true);
          }}
          onMouseLeave={() => {
            handleProfileClick(false);
          }}
        >
          <div
            tw="py-1 divide-y divide-gray-100"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <div tw="cursor-pointer">
              <Link href="/profile">
                <div tw="flex items-center px-4 py-2  text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white dark:hover:bg-gray-600">
                  <FontAwesomeIcon
                    icon={faUser}
                    style={{ marginRight: "10px" }}
                  />

                  <span tw="flex flex-col">
                    <span>Profile</span>
                  </span>
                </div>
              </Link>
            </div>

            <div tw="cursor-pointer">
              <button onClick={handleLogout} tw="w-full">
                <div tw="flex items-center px-4 py-2  text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white dark:hover:bg-gray-600">
                  <FontAwesomeIcon
                    icon={faSignOutAlt}
                    style={{ marginRight: "10px" }}
                  />

                  <span tw="flex flex-col">
                    <span>LogOut</span>
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default memo(UserHeaderSection);
