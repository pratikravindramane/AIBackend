const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    await mongoose.connect(
      `${process.env.MONGODB_URI}/${process.env.DATABASE_NAME}`,
      {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      }
    );
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
    throw error;
  }
};

module.exports = dbConnect;
