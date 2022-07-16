import { ImageInfo, ItemInterface } from "@Constants/Types";
import { fetchitems } from "@Functions/fetchItems";
import axios from "@Helpers/Axios";
import { useAuthStore } from "@Store/auth";
import { useItemStore } from "@Store/itemlist";
import { useShoppingCart } from "@Store/shoppingCart";
import { ObjectId } from "mongodb";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import Image from "next/image";
import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useMemo } from "react";

const updateDb = async (id: string, changes: any) => {
  await axios({
    url: "/api/database",
    method: "POST",
    headers: {
      ["x-custom-table"]: "items",
    },
    data: { id, changes },
  });
};

interface EditCompoentProps {
  title: string;
  field: string;
  value: string | number;
  isNumber?: boolean;
}
interface SingleItemProps {
  item: ItemInterface;
  isNewItem?: boolean;
}

interface AdminImageDisplayProps {
  addNewImage?: boolean;
  image: ImageInfo;
  index: number;
  item: ItemInterface;
  setItem: (item: ItemInterface) => any;
}
const emptyImage = {} as ImageInfo;

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
      updateDb(resourceId, { $set: { extraImages, image } });
      changeToInput(false);
      setChangeModal(false);
    }
  };
  const UpdateImageSection = useMemo(() => {
    return (
      <>
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
                updateDb(resourceId, { $set: { extraImages, image } });
                changeToInput(false);
                setChangeModal(false);

                console.info(newUrl);
              })
              .catch((err) => {
                console.warn(err);
              });
          }}
        />
        <button
          className="bg-white w-3/4 hover:bg-gray-100 text-gray-800 font-semibold py-1 px-2 border border-gray-400 rounded shadow"
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
                    updateDb(resourceId, {
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
function SingleItem({ item: defaultItem, isNewItem }: SingleItemProps) {
  const { _id: resourceId } = defaultItem;
  const [item, setItem] = useState(defaultItem);
  const [isEditMode, setEditMode] = useState(!!isNewItem);

  const { user, isAdmin } = useAuthStore((s) => ({
    user: s.user,
    isAdmin: s.isEditEnable,
  }));

  const userId = user?._id?.toString() || "";
  const { replaceItem, getItem } = useItemStore((state) => ({
    replaceItem: state.replaceItem,
    getItem: state.getItem,
  }));

  useEffect(() => {
    if (isNewItem) {
      return;
    }
    const itemdata = getItem(resourceId, defaultItem);
    if (itemdata) {
      if (itemdata.extraImages?.length) {
        if (itemdata.image?.url !== itemdata.extraImages[0]?.url) {
          itemdata.extraImages.unshift(itemdata.image);
        }
      } else if (itemdata.image) {
        itemdata.extraImages = [itemdata.image];
      }
      setItem({ ...itemdata });
    }
  }, [defaultItem, isNewItem]);

  const {
    image = emptyImage,
    price,
    title,
    description,
    extraImages = [],
  } = item;

  const toggleEdit = () => isAdmin && setEditMode((e) => !e);

  const updateInfo = (field: string, value: any) => {
    // @ts-ignore
    const currValue = item[field];
    if (value !== currValue) {
      const changes = {
        [field]: value,
      } as ItemInterface;
      replaceItem(changes, resourceId);
      setItem({ ...item, ...changes });
      updateDb(resourceId, {
        $set: changes,
      });
    }
  };

  const EditComponent = useCallback(
    ({ title, value, field, isNumber }: EditCompoentProps) => {
      return (
        <div className="flex w-full justify-center items-center">
          <div className="pr-2 py-2 w-28 self-center">{title}</div>
          <input
            defaultValue={value}
            onBlur={(e) => {
              let newValue = e.target.value as string | number;
              if (isNumber) {
                newValue = +newValue;
              }
              updateInfo(field, newValue);
            }}
            className="flex-grow w-full border-b-2 border-black bg-transparent m-0 p-0"
          />
        </div>
      );
    },
    [resourceId]
  );

  return (
    <div className="w-full flex flex-col md:flex-row relative">
      {isAdmin && (
        <div
          className="absolute top-0 right-0 px-4 py-2 cursor-pointer"
          onClick={toggleEdit}
        >
          {isEditMode ? "Done" : "Edit"}
        </div>
      )}
      {isEditMode ? (
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
            image={image}
            index={-1}
            setItem={setItem}
            item={item}
          />
        </div>
      ) : (
        <div className="h-full w-full md:w-1/2 p-6 flex transition-all duration-100 ease-in">
          {image?.url ? (
            // PRIMARY IMAGE
            <Image
              src={image.url}
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
      <div
        className={
          "w-full md:w-1/2 p-6 flex flex-col " +
          (isEditMode ? "" : "justify-center")
        }
      >
        <div className="font-bold	text-xl	">
          {isEditMode ? (
            <EditComponent title="Title:" value={title} field={"title"} />
          ) : (
            title
          )}
        </div>
        <div className="py-3">
          <span className="font-bold">Description</span>
          <p>
            {isEditMode ? (
              <textarea
                defaultValue={description}
                onBlur={(e) => {
                  const newValue = e.target.value;
                  updateInfo("description", newValue);
                }}
                className="w-full border-b-2 border-black"
                rows={5}
              />
            ) : (
              description || "No Description Available !!"
            )}
          </p>
        </div>
        {isEditMode ? (
          <div className="flex flex-col ">
            <EditComponent
              title="Price To Display:"
              value={price}
              field={"price"}
            />
            <EditComponent
              title="Actual Price:"
              value={item.actualPrice}
              field={"actualPrice"}
              isNumber
            />
            <EditComponent
              title="Quantity:"
              value={item.quantity}
              field={"quantity"}
              isNumber
            />
          </div>
        ) : (
          <BottomSection
            price={price}
            userId={userId}
            item={item}
            replaceItem={replaceItem}
            setItem={setItem}
          />
        )}
      </div>
    </div>
  );
}

export default SingleItem;

interface BottomSectionProps {
  price: string;
  userId: string;
  item: ItemInterface;
  replaceItem: (value: ItemInterface, index?: number | string) => void;
  setItem: (value: ItemInterface) => void;
}
const BottomSection = ({
  price,
  userId,
  item,
  replaceItem,
  setItem,
}: BottomSectionProps) => {
  const {
    _id: resourceId,
    favourates = [],
    actualPrice,
    extraImages = [],
  } = item || {};
  const {
    getItemQuantity,
    increaseCartQuantity,
    decreaseCartQuantity,
    removeFromCart,
    setUserId,
    userId: currentUserId,
  } = useShoppingCart();

  useEffect(() => {
    if (userId && userId !== currentUserId) {
      setUserId(userId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId, userId]);

  const currentItemQuantity = getItemQuantity(resourceId);
  const isFavoriteMark = userId ? favourates?.includes(userId) : false;
  const favCss = ["h-6 w-6 fill-current text-gray-500 hover:text-black"];
  if (isFavoriteMark) {
    favCss.push("text-red-600 hover:text-red-400");
  }

  const addQuantity = (e: any) => {
    e.preventDefault();
    increaseCartQuantity(resourceId, actualPrice);
  };
  const removeQuantity = (e: any) => {
    e.preventDefault();
    decreaseCartQuantity(resourceId);
  };
  const removeItem = (e: any) => {
    e.preventDefault();
    removeFromCart(resourceId);
  };
  return (
    <Fragment>
      <div className="pt-3 w-full flex flex-row">
        <p className="pt-1 w-1/2 text-gray-900">
          {price || "No Price Present"}
        </p>
        <div>
          <svg
            onClick={(e) => {
              e.preventDefault();
              if (!userId) {
                alert("Please Login");
                return;
              }
              if (!Array.isArray(item.favourates)) {
                item.favourates = [];
              }
              if (isFavoriteMark) {
                item.favourates = item.favourates.filter((id) => id !== userId);
                updateDb(resourceId, {
                  $pull: {
                    favourates: userId,
                  },
                });
              } else {
                item.favourates.push(userId);
                updateDb(resourceId, {
                  $addToSet: {
                    favourates: userId,
                  },
                });
              }
              replaceItem(item, resourceId);
            }}
            className={favCss.join(" ")}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M12,4.595c-1.104-1.006-2.512-1.558-3.996-1.558c-1.578,0-3.072,0.623-4.213,1.758c-2.353,2.363-2.352,6.059,0.002,8.412 l7.332,7.332c0.17,0.299,0.498,0.492,0.875,0.492c0.322,0,0.609-0.163,0.792-0.409l7.415-7.415 c2.354-2.354,2.354-6.049-0.002-8.416c-1.137-1.131-2.631-1.754-4.209-1.754C14.513,3.037,13.104,3.589,12,4.595z M18.791,6.205 c1.563,1.571,1.564,4.025,0.002,5.588L12,18.586l-6.793-6.793C3.645,10.23,3.646,7.776,5.205,6.209 c0.76-0.756,1.754-1.172,2.799-1.172s2.035,0.416,2.789,1.17l0.5,0.5c0.391,0.391,1.023,0.391,1.414,0l0.5-0.5 C14.719,4.698,17.281,4.702,18.791,6.205z" />
          </svg>
        </div>
      </div>

      <div className=" pt-3 w-full flex flex-row">
        {currentItemQuantity === 0 ? (
          <div
            className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
            onClick={addQuantity}
          >
            + Add To Cart
          </div>
        ) : (
          <>
            <div className="w-1/2 flex">
              <div className="cursor-pointer flex justify-center align-middle bg-transparent text-blue-700 font-semibold py-2 px-4 border border-grey-500 hover:rounded transition-all duration-100 ease-in">
                <svg
                  onClick={removeQuantity}
                  className="fill-current text-gray-600 w-3"
                  viewBox="0 0 448 512"
                >
                  <path d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
                </svg>
              </div>
              <div className="mx-2 text-center w-5 flex justify-center align-middle font-semibold py-2 px-4 ">
                {currentItemQuantity}
              </div>
              <div className="cursor-pointer flex justify-center align-middle bg-transparent text-blue-700 font-semibold py-2 px-4 border border-grey-500 hover:rounded transition-all duration-100 ease-in">
                <svg
                  onClick={addQuantity}
                  className="fill-current text-gray-600 w-3"
                  viewBox="0 0 448 512"
                >
                  <path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
                </svg>
              </div>
            </div>
            <div
              onClick={removeItem}
              className="cursor-pointer bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
            >
              Delete
            </div>
          </>
        )}
      </div>
      <div className="pt-3 w-full flex flex-wrap">
        {extraImages.map((image, index) => {
          const { url, alt = `Image-${index}` } = image;
          const isActive = item?.image?.url === url;

          return (
            <div
              key={index}
              className={
                "transition-all duration-100 ease-in p-2 border-gray-200 w-24 h-24 " +
                (isActive ? "border-t-2 shadow-xl" : "border-0 shadow-none")
              }
              onClick={() => {
                try {
                  item.image = image;
                  setItem({ ...item });
                } catch (err) {}
              }}
            >
              <Image
                src={url}
                alt={alt}
                width="100%"
                height="100%"
                layout="responsive"
                objectFit="contain"
              />
            </div>
          );
        })}
      </div>
    </Fragment>
  );
};

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<any>> {
  try {
    const { query } = context;
    if (query.itemId === "new-item") {
      const _id = new ObjectId();
      return {
        props: {
          item: {
            _id: _id.toString(),
          },
          isNewItem: true,
        },
      };
    }
    const itemResult = await fetchitems({ filter: { _id: query.itemId } });
    return {
      props: { item: itemResult.data[0] || { _id: query.itemId } },
    };
  } catch (err) {
    return { notFound: true };
  }
}
