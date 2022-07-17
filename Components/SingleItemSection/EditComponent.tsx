import React, { FocusEvent } from "react";

interface EditCompoentProps {
  title: string;
  field: string;
  value: string | number;
  updateInfo: (field: string, value: any) => void;
  isNumber?: boolean;
  isTextArea?: boolean;
}
const EditComponent = (props: EditCompoentProps) => {
  const { title, value, field, isNumber, updateInfo, isTextArea } = props;

  const paramProps = {
    defaultValue: value,
    onBlur: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      let newValue = e.target.value as string | number;
      if (isNumber) {
        newValue = +newValue;
      }
      updateInfo(field, newValue);
    },
    className: "w-full border-b-2 border-black bg-transparent m-0 p-0",
  };
  return (
    <div className="flex w-full flex-col md:flex-row">
      <div className="pr-2 py-2 w-1/4 md:self-center font-bold">{title}</div>
      {isTextArea ? (
        <textarea {...paramProps} rows={5} />
      ) : (
        <input {...paramProps} />
      )}
    </div>
  );
};

export default EditComponent;
