import { useFilterStore } from "@Store/filter_store";
import React, { memo, useEffect, useState } from "react";

function StoreSection() {
  return (
    <nav id="store" className="w-full top-0 px-6 py-1">
      <div className="w-full mx-auto flex flex-wrap items-center justify-between mt-0 px-2 py-3">
        <a
          className="uppercase tracking-wide no-underline hover:no-underline font-bold text-gray-800 text-xl "
          href="#"
        >
          Store
        </a>
        <div className="flex items-center" id="store-nav-content">
          <FilterSection />

          <div className="group flex pl-4 relative overflow-hidden ">
            {/* <div className="w-0 translate-x-[30rem] group-hover:translate-x-0 group-hover:w-full duration-300">
              Search Text bar
            </div> */}
            <div className="pl-3 inline-block no-underline hover:text-black">
              <svg
                className="fill-current hover:text-black"
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
              >
                <path d="M10,18c1.846,0,3.543-0.635,4.897-1.688l4.396,4.396l1.414-1.414l-4.396-4.396C17.365,13.543,18,11.846,18,10 c0-4.411-3.589-8-8-8s-8,3.589-8,8S5.589,18,10,18z M10,4c3.309,0,6,2.691,6,6s-2.691,6-6,6s-6-2.691-6-6S6.691,4,10,4z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default memo(StoreSection);

const FilterSection = () => {
  const [isHovering, setHovering] = useState(false);
  const [isShowFilterOption, setShowFilterOption] = useState(false);
  const [isShowElement, setShowElement] = useState(false);

  const { ALL_FILTERS, filterCount, toogleFilter } = useFilterStore(
    (state) => state
  );

  useEffect(() => {
    let t1: NodeJS.Timeout, t2: NodeJS.Timeout;
    if (isHovering != isShowFilterOption) {
      t1 = setTimeout(() => {
        setShowFilterOption(!!isHovering);
      }, 10);
    }
    if (isHovering != isShowElement) {
      if (isHovering) {
        setShowElement(true);
      } else {
        t2 = setTimeout(() => {
          setShowElement(false);
        }, 100);
      }
    }
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isHovering, isShowElement, isShowFilterOption]);

  return (
    <>
      <div
        className="group z-10 relative cursor-pointer pl-3 inline-block no-underline hover:text-black hover:-translate-y-1"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {filterCount > 0 && (
          <div className="absolute bottom-[60%] left-[80%] font-size[small]">
            {filterCount}
          </div>
        )}
        <svg
          className="fill-current hover:text-black"
          xmlns="http://www.w3.org/2000/svg"
          width={24}
          height={24}
          viewBox="0 0 24 24"
        >
          <path d="M7 11H17V13H7zM4 7H20V9H4zM10 15H14V17H10z" />
        </svg>
        {isShowElement && (
          <div className="absolute bg-white py-2 w-56 right-0">
            {ALL_FILTERS.map((filter, index) => {
              const { title, active } = filter;
              let allCss = ["overflow-hidden bg-white hover:bg-[#f5f5f5]"];
              if (active) {
                allCss.push("bg-[#f0f0f0]");
              }
              if (isShowFilterOption) {
                allCss.push("px-4 py-2 my-1 h-10");
              } else {
                allCss.push("p-0 m-0 h-0");
              }
              return (
                <div
                  key={index}
                  className={allCss.join(" ")}
                  onClick={() => {
                    setHovering(false);
                    toogleFilter(filter);
                  }}
                >
                  {title}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};
