import { ObjectId } from "mongodb";

export interface ResponseInterface {
  success: boolean;
  error?: string;
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

export interface ItemInterface extends MandatoryFields {
  title: string;
  imageUrl: string;
  price: string;
  actualPrice: number;
  quantity: number;
  description: string;
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
