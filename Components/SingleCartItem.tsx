import React, { Fragment, useEffect, useState } from "react";
import { ItemInterface, SignleItemCartInterface } from "../Constants/Types";
import { useItemStore } from "../Store/itemlist";

interface MyProps {
  data: SignleItemCartInterface;
}
function SingleCartItem({ data }: MyProps) {
  const fetchItemData = useItemStore((s) => s.getItem);
  const [item, setItem] = useState<ItemInterface>();
  useEffect(() => {
    let mount = true;
    const getItem = async () => {
      const itemValue = await fetchItemData(data._id);
      if (mount) {
        setItem(itemValue);
      }
    };
    getItem();
    return () => {
      mount = false;
    };
  }, [data._id]);
  return (
    <Fragment>
      <div>SingleCartItem</div>
      <div>{JSON.stringify(data)}</div>
      <hr />
      <div>{JSON.stringify(item)}</div>

      {/* <img
        src={item.imgUrl}
        style={{ width: "125px", height: "75px", objectFit: "cover" }}
      />
      <div className="me-auto">
        <div>
          {item.name}{" "}
          {quantity > 1 && (
            <span className="text-muted" style={{ fontSize: ".65rem" }}>
              x{quantity}
            </span>
          )}
        </div>
        <div className="text-muted" style={{ fontSize: ".75rem" }}>
          {formatCurrency(item.price)}
        </div>
      </div>
      <div> {formatCurrency(item.price * quantity)}</div>
      <Button
        variant="outline-danger"
        size="sm"
        onClick={() => removeFromCart(item.id)}
      >
        &times;
      </Button> */}
    </Fragment>
  );
}

export default SingleCartItem;
