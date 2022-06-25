import tw, { TwStyle } from "twin.macro";
import {
  ChangeEvent,
  HTMLInputTypeAttribute,
  InputHTMLAttributes,
} from "react";

interface IProps {
  styles?: string | TwStyle[];
  type: string;
  placeholder: string;
  value: string;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const FormInput = ({
  styles: newStyles,
  type,
  placeholder,
  value,
  handleChange,
  ...rest
}: IProps & InputHTMLAttributes<HTMLInputTypeAttribute>) => {
  const styles = Array.prototype.concat(
    [
      tw`focus:outline-none focus:bg-white`,
      tw`appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-400 rounded py-3 px-4 mb-3 leading-tight`,
    ],
    newStyles
  );

  return (
    <input
      {...rest}
      // @ts-ignore
      css={styles}
      type={type}
      placeholder={placeholder}
      onChange={handleChange}
      value={value}
    />
  );
};

export default FormInput;
