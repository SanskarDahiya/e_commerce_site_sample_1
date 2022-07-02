const mongoose = require("mongoose");

export const Users = mongoose.model("users", {
  name: String,
  email: String,
  password: String,
  _createdOn: Date,
  _updatedOn: Date,
  isAdmin: Boolean,
});

export const Posts = mongoose.model("items", {
  title: String,
  imageUrl: String,
  price: String,
  favourates: [String],
  description: String,
  actualPrice: Number,
  _createdOn: Date,
  _updatedOn: Date,
  quantity: Number,
});
