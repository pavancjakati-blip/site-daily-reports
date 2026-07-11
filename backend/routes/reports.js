const express = require("express");

const router = express.Router();


const {
    getReportsBySite,
    getReportByDate,
    createReport
} = require("../controllers/reportsController");


const {
    validateReport
} = require("../middleware/validation");


// ==========================================
// GET ALL REPORTS FOR SITE
// ==========================================

router.get(
    "/:id/reports",
    getReportsBySite
);


// ==========================================
// GET REPORT BY DATE
// ==========================================

router.get(
    "/:id/reports/:date",
    getReportByDate
);


// ==========================================
// CREATE DAILY REPORT
// ==========================================

router.post(
    "/:id/reports",
    validateReport,
    createReport
);


// ==========================================
// EXPORT ROUTER
// ==========================================

module.exports = router;