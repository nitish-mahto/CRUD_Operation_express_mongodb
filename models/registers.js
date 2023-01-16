import mongoose from "mongoose";
// import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const EmployeeSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  // cpassword: {
  //   type: String,
  //   required: true,
  // },
  gender: {
    type: String,
    requiredt: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

EmployeeSchema.methods.generatAuthToken = async function () {
  try {
    // console.log(this._id);
    const token = jwt.sign(
      { _id: this._id.toString() },
      process.env.SECRET_KEY
    );
    this.tokens = this.tokens.concat({ token });
    await this.save();
    return token;
  } catch (error) {
    res.send("The error part : " + error.message);
  }
};

// EmployeeSchema.pre("save", async function (next) {
//   if (this.isModified("password")) {
//     // console.log(`Current password is ${this.password}`);
//     password = await bcrypt.hash(password, 10);
//     // console.log(`The current password is ${this.password}`);
//     this.cpassword = undefined;
//   }
//   next();
// });

const Register = mongoose.model("emp", EmployeeSchema);

export default Register;
// module.exports = Register;
