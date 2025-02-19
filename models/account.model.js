const mongoose = require("mongoose");
const generate = require("../helpers/generate");

const AccountSchema = new mongoose.Schema(
  {
    fullname: String,
    email: String,
    password: String,
    phone:String,
    avatar: String,
    role_id: String,
    status: String,
    token: {
        type: String,
        default: generate.generateNumberString(20)
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

const Account = mongoose.model("Account", AccountSchema, "Accounts");

module.exports = Account;
