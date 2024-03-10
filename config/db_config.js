
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
      const conn = await mongoose.connect(`mongodb+srv://anitha22bca:Anitha22@cluster0.12v7rtz.mongodb.net/Demo`, {
        useNewUrlParser: true,
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.log(error.message);
      process.exit(1);
    }
  }

module.exports = connectDB;