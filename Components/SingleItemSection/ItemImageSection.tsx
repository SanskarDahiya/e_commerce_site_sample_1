import { ImageInfo, ItemInterface } from "@Constants/Types";
import { updateItemInfo } from "@Functions/updateInfo";
import axios from "@Helpers/Axios";
import FlipAnimation from "@Helpers/FlipAnimation";
import Image from "next/image";
import React, { Fragment, useMemo, useRef, useState } from "react";
const isItemUploadDisable = true;

interface ItemImageSectionProps {
  isEditMode: boolean;
  item: ItemInterface;
  setItem: (item: ItemInterface) => any;
}

interface AdminImageDisplayProps {
  addNewImage?: boolean;
  image: ImageInfo;
  index: number;
  item: ItemInterface;
  setItem: (item: ItemInterface) => any;
}
const AdminImageDisplay = (props: AdminImageDisplayProps) => {
  const { index, image, item, setItem, addNewImage } = props;
  const primaryImage = image || {};
  const uploadImageRef = useRef<HTMLInputElement>(null);
  const uploadImageProgress = useRef(false);
  const changeImageRef = useRef<HTMLInputElement>(null);
  const { _id: resourceId, extraImages = [] } = item;
  const [changeModal, setChangeModal] = useState(false);
  const [isShowInputModal, showInputModal] = useState(false);
  const isActive = index === 0;

  const updateUrlForItem = async (newUrl: string) => {
    console.info(newUrl);
    if (!newUrl) return;

    if (addNewImage) {
      if (!primaryImage?.url) {
        primaryImage.url = newUrl;
        item.image = primaryImage;
      }
      extraImages.push({ url: newUrl });
    } else {
      extraImages[index].url = newUrl;
      item.extraImages = extraImages;
      if (index === 0) {
        primaryImage.url = newUrl;
        item.image = primaryImage;
      }
    }
    setItem({ ...item });
    updateItemInfo(resourceId, {
      $set: { extraImages, image: primaryImage },
    });
    showInputModal(false);
    setChangeModal(false);
  };

  const handleUploadClick = async () => {
    try {
      const files = uploadImageRef.current?.files || [];
      console.log("File Change", files);
      const file = files[0];
      if (!file || isItemUploadDisable) return;
      if (uploadImageProgress.current) {
        // Show Modal
        return;
      }
      uploadImageProgress.current = true;
      const formdata = new FormData();
      formdata.append("file", file);
      const { data } = await axios.post("/api/upload", formdata);
      const newUrl = data?.result?.path;
      console.info(newUrl);
      if (!newUrl) {
        throw new Error("Unable to retrive path");
      }
      await updateUrlForItem(newUrl);
    } catch (err) {
      console.warn(err);
    }
    uploadImageProgress.current = false;
  };

  const handleChangeUrl = async (cb: () => void) => {
    try {
      if (changeImageRef.current?.validity?.valid) {
        const newUrl = changeImageRef.current.value.trim();
        await updateUrlForItem(newUrl);
      }
    } catch (err) {}
    showInputModal(false);
    setChangeModal(false);
    cb();
  };

  const BackCardComponent = (flipToIndex: (index: number) => void) => (
    <div className="w-full h-full text-black p-2 flex flex-col justify-around items-center">
      <>
        <button
          className={
            "bg-white w-3/4 hover:bg-gray-100 text-gray-800 font-semibold py-1 px-2 border border-gray-400 rounded shadow disabled:cursor-not-allowed"
          }
          disabled={isItemUploadDisable}
          onClick={() => {
            uploadImageRef.current?.click();
          }}
        >
          Upload
        </button>
        {isShowInputModal ? (
          <input
            ref={changeImageRef}
            required
            autoFocus
            className="invalid:text-red-500 invalid:border-red-500 w-full bg-white hover:bg-gray-100 text-gray-800 py-1 px-2 border border-gray-400 rounded shadow"
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              switch (e?.code?.toLowerCase()) {
                case "enter":
                case "escape":
                  changeImageRef.current?.blur();
                  break;
                default:
                  break;
              }
            }}
            onBlur={() => handleChangeUrl(() => flipToIndex(0))}
          />
        ) : (
          <button
            onClick={() => {
              showInputModal(true);
            }}
            className="bg-white w-3/4 hover:bg-gray-100 text-gray-800 font-semibold py-1 px-2 border border-gray-400 rounded shadow"
          >
            Add Url
          </button>
        )}
      </>

      {!addNewImage && (
        <button
          className="bg-white w-3/4 hover:bg-gray-100 text-gray-800 font-semibold py-1 px-2 border border-gray-400 rounded shadow"
          onClick={() => flipToIndex(0)}
        >
          back
        </button>
      )}
    </div>
  );
  return (
    <Fragment>
      <input
        ref={uploadImageRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleUploadClick}
      />
      <div
        className={
          "relative transition-all duration-200 ease-in border-gray-200 m-1 w-36 h-36 " +
          (isActive || true ? "border-t-2 shadow-xl" : "border-0 shadow-none") +
          (changeModal ? " rotate_y_180	" : "rotate-0")
        }
      >
        {addNewImage ? (
          BackCardComponent(() => {})
        ) : (
          <FlipAnimation>
            {({ flipToIndex }) => {
              return [
                <div key="front-side" className="h-full w-full">
                  {primaryImage?.url ? (
                    <Image
                      src={primaryImage?.url}
                      alt={primaryImage?.alt || `Image->${index}`}
                      width="100%"
                      height="100%"
                      layout="responsive"
                      objectFit="contain"
                    />
                  ) : (
                    "No Image Present"
                  )}
                  <div
                    className={
                      "absolute h-1/2 inset-x-0 bottom-0 flex justify-around items-end bg-gradient-to-t from-gray-700 to-transparent text-white "
                    }
                  >
                    {index !== 0 && (
                      <div
                        className="transition-all duration-100 ease-in hover:py-2 cursor-pointer"
                        onClick={() => {
                          extraImages.splice(index, 1);
                          setItem({ ...item, extraImages });
                          updateItemInfo(resourceId, { $set: { extraImages } });
                        }}
                      >
                        Delete
                      </div>
                    )}
                    <div
                      className="transition-all duration-400 ease-in hover:py-2 cursor-pointer"
                      onClick={() => flipToIndex(1)}
                    >
                      Change
                    </div>
                  </div>
                </div>,
                <Fragment key="back-side">
                  {BackCardComponent(flipToIndex)}
                </Fragment>,
              ];
            }}
          </FlipAnimation>
        )}
      </div>
    </Fragment>
  );
};

function ItemImageSection(props: ItemImageSectionProps) {
  const { item, setItem, isEditMode } = props;
  const { image: primaryImage, extraImages = [] } = item;
  return (
    <>
      {isEditMode === true ? (
        <div className="pt-3 flex flex-wrap w-full md:w-1/2 p-2 transition-all duration-100 ease-in">
          {extraImages.map((image, index) => (
            <AdminImageDisplay
              key={`${image?.url}-${index}`}
              image={image}
              index={index}
              setItem={setItem}
              item={item}
            />
          ))}
          <AdminImageDisplay
            addNewImage
            image={item?.image}
            index={-1}
            setItem={setItem}
            item={item}
          />
        </div>
      ) : (
        <div className="h-full w-full md:w-1/2 p-6 flex">
          {primaryImage?.url ? (
            // PRIMARY IMAGE
            <Image
              src={primaryImage.url}
              alt="Image-Section"
              quality={80}
              height={400}
              width={400}
              objectFit="contain"
            />
          ) : (
            "No Image Present"
          )}
        </div>
      )}
    </>
  );
}

export default ItemImageSection;
