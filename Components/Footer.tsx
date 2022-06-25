import "twin.macro";
import React from "react";

function Footer() {
  return (
    <footer tw="container mx-auto bg-white py-8 border-t border-gray-400">
      <div tw="container flex px-3 py-8 ">
        <div tw="w-full mx-auto flex flex-wrap">
          <div tw="flex w-full lg:w-1/2 ">
            <div tw="px-3 md:px-0">
              <h3 tw="font-bold text-gray-900">About</h3>
              <p tw="py-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Maecenas vel mi ut felis tempus commodo nec id erat. Suspendisse
                consectetur dapibus velit ut lacinia.
              </p>
            </div>
          </div>
          <div tw="flex w-full lg:w-1/2 lg:justify-end lg:text-right">
            <div tw="px-3 md:px-0">
              <h3 tw="font-bold text-gray-900">Social</h3>
              <ul tw="list-disc items-center pt-3">
                <li>
                  <a
                    tw="inline-block no-underline hover:text-black hover:underline py-1"
                    href="#"
                  >
                    Add social links
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
