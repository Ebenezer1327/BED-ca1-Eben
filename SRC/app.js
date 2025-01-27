const express = require("express");
const dotenv = require("dotenv");
const logger = require("./middleware/logger");
const cors = require('cors');



dotenv.config();

const app = express();
const port = 3000;

app.use(cors());


//Middleware
app.use(express.json());
app.use(logger);


//Routes
const mainRoutes = require('./routes/mainRoutes');
app.use("/", mainRoutes);



// Start the server 
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000')
})