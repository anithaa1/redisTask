
// User registration
// User login
// Access token generation using JWT
// Token caching using Redis for improved performance

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;
const router=require("./router/router")
app.use(bodyParser.json());
const connectDB = require("./config/db_config");
connectDB();
 app.use('/api/auth', router);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });