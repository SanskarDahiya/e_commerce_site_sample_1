import { ItemInterface } from "@Constants/Types";
import { updateItemInfo } from "@Functions/updateInfo";
import { useAuthStore } from "@Store/auth";
import { useItemStore } from "@Store/itemlist";
import React, { useEffect, useState } from "react";
import ItemImageSection from "./ItemImageSection";
import BottomItemSection from "./BottomItemSection";
import EditComponent from "./EditComponent";
import { useCallback } from "react";

interface SingleItemProps {
  item: ItemInterface;
  isNewItem?: boolean;
}

function SingleItemSection({ item: defaultItem, isNewItem }: SingleItemProps) {
  const { _id: resourceId } = defaultItem;
  const [item, setItem] = useState(defaultItem);

  const isAdmin = useAuthStore((s) => s.isEditEnable);
  const [isEditMode, setEditMode] = useState(!!isNewItem); // Edit mode is enabled to add new item
  const toggleItemEditMode = () => isAdmin && setEditMode((mode) => !mode);

  useEffect(() => {
    if (!isAdmin && isEditMode) {
      setEditMode(false);
    }
  }, [isAdmin, isEditMode]);

  const { replaceItem, getItem } = useItemStore((state) => ({
    replaceItem: state.replaceItem,
    getItem: state.getItem,
  }));

  defaultItem = getItem(resourceId, defaultItem);

  useEffect(() => {
    if (isNewItem) {
      return;
    }
    const extraImages = defaultItem.extraImages || [];
    const primaryImage = defaultItem.image;
    if (extraImages.length) {
      if (primaryImage?.url !== extraImages[0]?.url) {
        extraImages.unshift(defaultItem.image);
        setItem({ ...defaultItem, extraImages });
      }
    } else if (primaryImage?.url) {
      setItem({ ...defaultItem, extraImages: [primaryImage] });
    }
  }, [defaultItem, isNewItem]);

  const ItemUpdate = useCallback(
    (field: string, value: any) => {
      // @ts-ignore
      const currValue = item[field];
      if (value !== currValue) {
        const changes = {
          [field]: value,
        } as ItemInterface;
        replaceItem(changes, resourceId);
        setItem({ ...item, [field]: value });
        updateItemInfo(resourceId, { $set: changes });
      }
    },
    [item]
  );

  const { title, description } = item;
  return (
    <div className="w-full flex flex-col md:flex-row relative px-10">
      {isAdmin && (
        <div
          className="absolute top-3 right-3 px-4 py-2 cursor-pointer"
          onClick={toggleItemEditMode}
        >
          {isEditMode ? "Done" : "Edit"}
        </div>
      )}
      <ItemImageSection isEditMode={isEditMode} item={item} setItem={setItem} />

      <div
        className={
          "w-full md:w-1/2 p-6 flex flex-col " +
          (isEditMode ? "" : "justify-center")
        }
      >
        {isEditMode ? (
          <>
            <EditComponent
              title="Title:"
              value={title}
              field={"title"}
              updateInfo={ItemUpdate}
            />
            <EditComponent
              isTextArea
              title="Description:"
              value={description}
              field={"description"}
              updateInfo={ItemUpdate}
            />
            <EditComponent
              title="Price To Display:"
              value={item.price}
              field={"price"}
              updateInfo={ItemUpdate}
            />
            <EditComponent
              title="Actual Price:"
              value={item.actualPrice}
              field={"actualPrice"}
              updateInfo={ItemUpdate}
              isNumber
            />
            <EditComponent
              title="Quantity:"
              value={item.quantity}
              field={"quantity"}
              updateInfo={ItemUpdate}
              isNumber
            />
          </>
        ) : (
          <>
            <div className="font-bold	text-xl	">
              {title || "No Title Present"}
            </div>
            <div className="py-3">
              <span className="font-bold">Description</span>
              <p>{description || "No Description Available !!"}</p>
            </div>

            <BottomItemSection item={item} setItem={setItem} />
          </>
        )}
      </div>
    </div>
  );
}

export default SingleItemSection;
