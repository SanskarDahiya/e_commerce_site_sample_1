import "twin.macro";
import React, { memo } from "react";
import Link from "next/link";
import UserHeaderSection from "@helpers/UserHeaderSection";
import CartHeaderSection from "@helpers/CartHeaderSection";
import AdminHeaderSection from "@helpers/AdminHeaderSection";

const HEADER_DATA = {
  header: {
    title: "NORDICS",
    icon: "",
  },
  menuOption: [
    {
      link: "/",
      title: "Shop",
    },
    {
      link: "/about",
      title: "About",
    },
  ],
};
function Header() {
  const { menuOption, header } = HEADER_DATA;
  return (
    <nav id="header" tw="w-full top-0 py-1">
      <div tw="w-full mx-auto flex flex-wrap items-center justify-between mt-0 px-6 py-3 border-b border-gray-400">
        <label htmlFor="menu-toggle" tw="cursor-pointer md:hidden block">
          <svg
            tw="fill-current text-gray-900"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
          >
            <title>menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
          </svg>
        </label>
        <input tw="hidden" className="peer" type="checkbox" id="menu-toggle" />

        <div tw="hidden md:flex md:items-center md:w-auto w-full order-3 md:order-1 peer-checked:block">
          <nav>
            <ul tw="md:flex items-center justify-between text-base text-gray-700 pt-4 md:pt-0">
              {menuOption.map(({ title, link }, key) => (
                <li key={key}>
                  <Link href={link}>
                    <div tw="inline-block no-underline hover:text-black hover:underline py-2 px-4">
                      {title}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div tw="order-1 md:order-2 cursor-pointer">
          <Link href="/">
            <div tw="flex items-center tracking-wide no-underline hover:no-underline font-bold text-gray-800 text-xl">
              <svg
                tw="fill-current text-gray-800 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M5,22h14c1.103,0,2-0.897,2-2V9c0-0.553-0.447-1-1-1h-3V7c0-2.757-2.243-5-5-5S7,4.243,7,7v1H4C3.447,8,3,8.447,3,9v11 C3,21.103,3.897,22,5,22z M9,7c0-1.654,1.346-3,3-3s3,1.346,3,3v1H9V7z M5,10h2v2h2v-2h6v2h2v-2h2l0.002,10H5V10z" />
              </svg>
              {header.title}
            </div>
          </Link>
        </div>

        <div tw="order-2 md:order-3 flex items-center" id="nav-content">
          <AdminHeaderSection />
          <UserHeaderSection />
          <CartHeaderSection />
        </div>
      </div>
    </nav>
  );
}

export default memo(Header);
