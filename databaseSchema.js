const mongoose = require("mongoose");
const { Schema, Types, model } = mongoose;

const UserSchema = new Schema({
  name: String,
  email: String,
  password: String,
  isAdmin: Boolean,
  _createdOn: Date,
  _updatedOn: Date,
});

const PostSchema = new Schema({
  title: String,
  imageUrl: String,
  price: String,
  actualPrice: Number,
  quantity: Number,
  description: String,
  favourates: [{ type: Types.ObjectId, ref: "users" }],
  _createdOn: Date,
  _updatedOn: Date,
});

// const CartSchema = new Schema({
//   items: [{ type: Types.ObjectId, ref: "users" }],
//   itemsRef: { type: Map, of: String },
//   _createdOn: Date,
//   _updatedOn: Date,
// });

const Users = model("users", UserSchema);

const Posts = model("items", PostSchema);
// const Carts = model("user_cart", CartSchema);

const DataBases = [Users, Posts];

module.exports = DataBases;
