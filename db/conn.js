import mongoose from "mongoose";

mongoose.set("strictQuery", true);

const connection = async (DATABASE_URL) => {
  try {
    const DATABASE_OPTIONS = {
      dbName: "Employee",
    };
    mongoose
      .connect(DATABASE_URL, DATABASE_OPTIONS)
      .then(() => {
        console.log("conntion established");
      })
      .catch((err) => {
        console.log("Error in connection : " + err.message);
      });
  } catch (error) {
    console.log("Error : " + error.message);
  }
};

export default connection;
