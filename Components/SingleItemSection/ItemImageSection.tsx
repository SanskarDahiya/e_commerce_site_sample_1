import { ImageInfo, ItemInterface } from "@Constants/Types";
import { updateItemInfo } from "@Functions/updateInfo";
import axios from "@Helpers/Axios";
import Image from "next/image";
import React, { useMemo, useRef, useState } from "react";
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
  const uploadImageRef = useRef<HTMLInputElement>(null);
  const changeImageRef = useRef<HTMLInputElement>(null);
  const { _id: resourceId, extraImages = [] } = item;
  const [changeModal, setChangeModal] = useState(false);
  const [toInput, changeToInput] = useState(false);
  const { url, alt = `Image-${index}` } = image;
  const isActive = index === 0;
  const handleChangeUrl = () => {
    if (changeImageRef.current?.validity?.valid) {
      const newUrl = changeImageRef.current.value.trim();
      if (addNewImage) {
        if (!image?.url) {
          image.url = newUrl;
          item.image = image;
        }
        extraImages.push({ url: newUrl });
      } else {
        extraImages[index].url = newUrl;
        item.extraImages = extraImages;
        if (index === 0) {
          image.url = newUrl;
          item.image = image;
        }
      }

      setItem({ ...item });
      updateItemInfo(resourceId, { $set: { extraImages, image } });
      changeToInput(false);
      setChangeModal(false);
    }
  };
  const UpdateImageSection = useMemo(() => {
    return (
      <>
        {!isItemUploadDisable && (
          <input
            ref={uploadImageRef}
            type="file"
            className="hidden"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const file = e.target.files && e.target.files[0];
              console.log("File Change", file);
              if (!file) return;
              const formdata = new FormData();
              formdata.append("file", file);
              axios
                .post("/api/upload", formdata, {})
                .then((res) => {
                  const newUrl = res.data.result.path;

                  if (addNewImage) {
                    if (!image?.url) {
                      image.url = newUrl;
                      item.image = image;
                    }
                    extraImages.push({ url: newUrl });
                  } else {
                    extraImages[index].url = newUrl;
                    item.extraImages = extraImages;
                    if (index === 0) {
                      image.url = newUrl;
                      item.image = image;
                    }
                  }
                  setItem({ ...item });
                  updateItemInfo(resourceId, { $set: { extraImages, image } });
                  changeToInput(false);
                  setChangeModal(false);

                  console.info(newUrl);
                })
                .catch((err) => {
                  console.warn(err);
                });
            }}
          />
        )}
        <button
          className={
            "bg-white w-3/4 hover:bg-gray-100 text-gray-800 font-semibold py-1 px-2 border border-gray-400 rounded shadow " +
            (isItemUploadDisable && "disabled:cursor-not-allowed")
          }
          disabled={isItemUploadDisable}
          onClick={() => {
            uploadImageRef.current?.click();
          }}
        >
          Upload
        </button>
        {toInput ? (
          <input
            ref={changeImageRef}
            type="url"
            pattern="http.*"
            required
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
            onBlur={handleChangeUrl}
          />
        ) : (
          <button
            onClick={() => {
              changeToInput(true);
            }}
            className="bg-white w-3/4 hover:bg-gray-100 text-gray-800 font-semibold py-1 px-2 border border-gray-400 rounded shadow"
          >
            Add Url
          </button>
        )}
      </>
    );
  }, [toInput]);

  return (
    <div
      key={index}
      className={
        "relative transition-all duration-200 ease-in m-1 p-2  border-gray-200 w-36 h-36 " +
        (isActive ? "border-t-2 shadow-xl" : "border-0 shadow-none") +
        (changeModal ? " rotate_y_180	" : "rotate-0")
      }
    >
      {addNewImage ? (
        <div className="w-full h-full text-black absolute inset-0 p-2 flex flex-col justify-around items-center">
          {UpdateImageSection}
        </div>
      ) : (
        <>
          <div
            className={
              "w-full h-full transition-all duration-100 ease-in rotate_y_180 text-black absolute inset-0 p-2 flex flex-col justify-around items-center " +
              (changeModal ? "visible" : "invisible")
            }
          >
            {UpdateImageSection}
            <button
              className="bg-white w-3/4 hover:bg-gray-100 text-gray-800 font-semibold py-1 px-2 border border-gray-400 rounded shadow"
              onClick={() => {
                setChangeModal(false);
              }}
            >
              back
            </button>
          </div>
          <div
            className={
              "transition-all duration-100 ease-in " +
              (changeModal ? "invisible" : "visible")
            }
          >
            <Image
              src={url}
              alt={alt}
              width="100%"
              height="100%"
              layout="responsive"
              objectFit="contain"
            />
            <div
              className={
                "transition-all duration-100 ease-in absolute h-1/4 inset-x-2 bottom-0 flex justify-around items-end bg-gradient-to-t from-gray-700 to-transparent text-white " +
                (changeModal && "hidden")
              }
            >
              {index !== 0 && (
                <div
                  className="transition-all duration-100 ease-in hover:py-2 cursor-pointer"
                  onClick={() => {
                    extraImages.splice(index - 1, 1);
                    item.extraImages = extraImages;
                    setItem({ ...item });
                    updateItemInfo(resourceId, {
                      $set: {
                        extraImages,
                      },
                    });
                  }}
                >
                  Delete
                </div>
              )}
              <div
                className="transition-all duration-400 ease-in hover:py-2 cursor-pointer"
                onClick={() => {
                  setChangeModal(true);
                }}
              >
                Change
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

function ItemImageSection(props: ItemImageSectionProps) {
  const { item, setItem, isEditMode } = props;
  const { image: primaryImage, extraImages = [] } = item;
  return (
    <>
      {isEditMode === true ? (
        <div className="pt-3 flex flex-wrap w-full md:w-1/2 p-6 transition-all duration-100 ease-in">
          {extraImages.map((image, index) => (
            <AdminImageDisplay
              key={index}
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
        <div className="h-full w-full md:w-1/2 p-6 flex transition-all duration-100 ease-in">
          {primaryImage?.url ? (
            // PRIMARY IMAGE
            <Image
              src={primaryImage.url}
              alt="Image-Section"
              quality={80}
              height={400}
              width={400}
            />
          ) : (
            <>No Image Present</>
          )}
        </div>
      )}
    </>
  );
}

export default ItemImageSection;
