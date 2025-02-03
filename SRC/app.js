const express = require("express");
const dotenv = require("dotenv");
const logger = require("./middleware/logger");
const cors = require('cors');
const path = require("path");

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());

// Middleware
app.use(express.json());
app.use(logger);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));


app.use(express.static('public'));




// Routes
const mainRoutes = require('./routes/mainRoutes');
app.use("/", mainRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
