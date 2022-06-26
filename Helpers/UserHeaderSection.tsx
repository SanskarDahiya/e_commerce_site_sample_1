import "twin.macro";
import React, { Fragment, memo, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "../Store/auth";
import Cookies from "js-cookie";
import Router from "next/router";

function UserHeaderSection() {
  const [showUser, setShowUser] = useState(false);
  const { user, setRefreshToken, setAccessToken, setUser } = useAuthStore();

  const handleProfileClick = (status: boolean | null) => {
    if (!user) {
      setShowUser(false);
      return;
    }
    if (status === null) {
      setShowUser((a) => !a);
    } else {
      setShowUser(status);
    }
  };
  const handleLogout = () => {
    handleProfileClick(false);
    setRefreshToken(null);
    setAccessToken(null);
    setUser(undefined);
    Cookies.remove("token");
    Router.push("/");
  };
  return (
    <Fragment>
      <Link href={"/user"} passHref>
        <a
          tw="inline-block no-underline hover:text-black relative"
          className="peer"
          onMouseEnter={() => {
            handleProfileClick(true);
          }}
          onClick={() => {
            handleProfileClick(null);
          }}
        >
          {showUser && (
            <div
              tw="absolute z-10 top-[100%] right-0 p-2 bg-[#f5f5f5]"
              onClick={() => {
                handleProfileClick(false);
              }}
              onMouseLeave={() => {
                handleProfileClick(false);
              }}
            >
              <ul tw="md:flex cursor-pointer items-center justify-between text-base text-gray-700 md:pt-0 ">
                <li onClick={handleLogout}>
                  <div tw="inline-block no-underline hover:text-black hover:underline py-2 px-4">
                    Logout
                  </div>
                </li>
              </ul>
            </div>
          )}
          <svg
            tw="fill-current hover:text-black"
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
    </Fragment>
  );
}
export default memo(UserHeaderSection);
