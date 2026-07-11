const express = require("express");

const router = express.Router();


const {
    getAllSites,
    createSite
} = require("../controllers/sitesController");


const {
    validateSite
} = require("../middleware/validation");


// ==========================================
// GET ALL SITES
// ==========================================

router.get(
    "/",
    getAllSites
);


// ==========================================
// CREATE NEW SITE
// ==========================================

router.post(
    "/",
    validateSite,
    createSite
);


// ==========================================
// EXPORT ROUTER
// ==========================================

module.exports = router;