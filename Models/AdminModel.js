const mongoose = require('mongoose');
const validator = require("validator");
const bcrypt = require('bcryptjs');
const Constants = require('../Constants/rolesConstants');
const jwt = require("jsonwebtoken");
const crypto = require("crypto");


const adminSchema = mongoose.Schema({
   firstName: {
      type: String,
      required: true,
      minLength: [4, "Name should be more than 4 characters"],
   },
   lastName: {
      type: String,
      required: true,
      minLength: [4, "Name should be more than 4 characters"],
   },
   email: {
      type: String,
      required: true,
      validate: [validator.isEmail, "Please enter a valid email"],
      unique: true
   },
   password: {
      type: String,
      required: true,
      minLength: [8, "Password should be more than 8 characters"],
      maxLength: [30, "Password should be less than 30 characters"],
      select: false,
   },
   role: {
      type: String,
      required: true,
      default: Constants.ADMIN,
   },
   createdAt: {
      type: Date,
      immutable: true,
      default: () => { return Date.now(); }
   },
   updatedAt: {
      type: Date,
      default: () => { return Date.now(); }
   },
   resetPasswordToken: String,
   resetPasswordExpire: Date,
})


// Hash Password
adminSchema.pre("save", async function (next) {
   if (!this.isModified("password")) {
      next();
   }
   this.password = await bcrypt.hash(this.password, 10);
});

// Compare password method
adminSchema.methods.comparePassword = async function (enterPassword) {
   return await bcrypt.compare(enterPassword, this.password)
};

// get token method
adminSchema.methods.getJwtToken = function () {
   return jwt.sign(
      {
         id: this._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
   );
};


// Generate reset password token
adminSchema.methods.getResetPasswordToken = async function () {

   // Generate reset password token
   const resetToken = await crypto.randomBytes(20).toString("hex");

   //  reset Password Token
   this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

   this.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

   return resetToken
};

module.exports = mongoose.model("admin", adminSchema);