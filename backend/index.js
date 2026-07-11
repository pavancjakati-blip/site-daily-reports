const express = require("express");

const cors = require("cors");

require("dotenv").config();


const app = express();

const PORT = process.env.PORT || 3000;


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());

app.use(express.json());


// ==========================================
// IMPORT ROUTES
// ==========================================

const siteRoutes = require("./routes/sites");

const reportRoutes = require("./routes/reports");


// ==========================================
// USE ROUTES
// ==========================================

app.use(
    "/sites",
    siteRoutes
);


app.use(
    "/sites",
    reportRoutes
);


// ==========================================
// HOME ROUTE
// ==========================================

app.get("/", (req, res) => {

    return res.status(200).json({
        message: "Welcome to Site Daily Report API"
    });

});


// ==========================================
// ROUTE NOT FOUND
// ==========================================

app.use((req, res) => {

    return res.status(404).json({
        message: "Route not found"
    });

});


// ==========================================
// ERROR HANDLER
// ==========================================

const errorHandler = require(
    "./middleware/errorHandler"
);

app.use(errorHandler);


// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {

    console.log(
        ` Server running on port ${PORT}`
    );

});