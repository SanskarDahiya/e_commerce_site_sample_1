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
  handleBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  handleChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

const FormInput = ({
  styles: newStyles,
  type,
  placeholder,
  value,
  handleChange,
  handleBlur,
  ...rest
}: IProps & InputHTMLAttributes<HTMLInputTypeAttribute>) => {
  return (
    <input
      // {...rest}
      className={
        "focus:outline-none focus:bg-white appearance-none block w-full text-gray-700 border border-gray-400 rounded py-3 px-4 mb-3 leading-tight bg-gray-200 " +
        newStyles
      }
      type={type}
      placeholder={placeholder}
      onChange={handleChange}
      onBlur={handleBlur}
      defaultValue={value}
    />
  );
};

export default FormInput;
