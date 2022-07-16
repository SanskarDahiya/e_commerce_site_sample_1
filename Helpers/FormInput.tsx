import {
  ChangeEvent,
  HTMLInputTypeAttribute,
  InputHTMLAttributes,
} from "react";

interface IProps {
  styles?: string;
  type?: string;
  placeholder: string;
  value?: string;
  handleChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

const FormInput = ({
  styles: newStyles,
  type,
  placeholder,
  value,
  handleChange,
  ...rest
}: IProps & InputHTMLAttributes<HTMLInputTypeAttribute>) => {
  return (
    <input
      // {...rest}
      className={
        "focus:outline-none focus:bg-white appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-400 rounded py-3 px-4 mb-3 leading-tight " +
        newStyles
      }
      type={type}
      placeholder={placeholder}
      onChange={handleChange}
      value={value}
    />
  );
};

export default FormInput;
