export interface Toast {
  title?: string;
  message: string | React.ReactElement;
}
export interface ToastMessage extends Toast {
  readonly _id: string;
  type: "INFO" | "SUCCESS" | "WARNING" | "ERROR";
  _createdOn: Date;
  _expireOn: Date;
  timeout: number;
}
export interface ResponseInterface {
  success: boolean;
  error?: string;
  result?: any;
}

interface MandatoryFields {
  readonly _id: string;
  _updatedOn: Date;
  _createdOn: Date;
}

export interface AccessTokenInterface extends Omit<MandatoryFields, "_id"> {
  readonly _id: string;
  isAdmin: boolean;
  email: string;
}

export interface RefreshTokenInterface extends AccessTokenInterface {
  isRefreshToken?: true;
}

export interface UserInterface extends MandatoryFields {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
}
export interface ImageInfo {
  url: string;
  alt?: string;
  height?: number;
  width?: number;
}
export interface ItemInterface extends MandatoryFields {
  title: string;
  image: ImageInfo;
  price: string;
  actualPrice: number;
  quantity: number;
  description: string;
  extraImages?: ImageInfo[];
  favourates?: string[];
}

export interface SignleItemCartInterface extends MandatoryFields {
  price: number;
  qty: number;
}

export interface CartInterface extends MandatoryFields {
  items: string[];
  [resourceId: string]: SignleItemCartInterface | any;
}
