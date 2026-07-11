// ==========================================
// VALIDATE SITE
// ==========================================

const validateSite = (req, res, next) => {

    const {
        name,
        location
    } = req.body;


    if (
        name === undefined ||
        name === null ||
        name === ""
    ) {

        return res.status(400).json({
            message: "Name is required"
        });

    }


    if (
        location === undefined ||
        location === null ||
        location === ""
    ) {

        return res.status(400).json({
            message: "Location is required"
        });

    }


    if (
        typeof name !== "string" ||
        name.trim() === ""
    ) {

        return res.status(400).json({
            message: "Name must be valid text"
        });

    }


    if (
        typeof location !== "string" ||
        location.trim() === ""
    ) {

        return res.status(400).json({
            message: "Location must be valid text"
        });

    }


    next();

};


// ==========================================
// VALIDATE DAILY REPORT
// ==========================================

const validateReport = (req, res, next) => {

    const {
        report_date,
        workers_present,
        work_done,
        blockers,
        submitted_by
    } = req.body;


    // REPORT DATE

    if (
        report_date === undefined ||
        report_date === null ||
        report_date === ""
    ) {

        return res.status(400).json({
            message: "Report date is required"
        });

    }


    // WORKERS PRESENT

    if (
        workers_present === undefined ||
        workers_present === null
    ) {

        return res.status(400).json({
            message: "Workers present is required"
        });

    }


    // WORK DONE

    if (
        work_done === undefined ||
        work_done === null ||
        work_done === ""
    ) {

        return res.status(400).json({
            message: "Work done is required"
        });

    }


    // SUBMITTED BY

    if (
        submitted_by === undefined ||
        submitted_by === null ||
        submitted_by === ""
    ) {

        return res.status(400).json({
            message: "Submitted by is required"
        });

    }


    // DATE FORMAT

    const datePattern = /^\d{4}-\d{2}-\d{2}$/;


    if (!datePattern.test(report_date)) {

        return res.status(400).json({
            message: "Report date must use YYYY-MM-DD format"
        });

    }


    // WORKERS VALIDATION

    if (
        !Number.isInteger(workers_present) ||
        workers_present < 0
    ) {

        return res.status(400).json({
            message: "Workers present must be a non-negative integer"
        });

    }


    // WORK DONE VALIDATION

    if (
        typeof work_done !== "string" ||
        work_done.trim() === ""
    ) {

        return res.status(400).json({
            message: "Work done must be valid text"
        });

    }


    // SUBMITTED BY VALIDATION

    if (
        typeof submitted_by !== "string" ||
        submitted_by.trim() === ""
    ) {

        return res.status(400).json({
            message: "Submitted by must be valid text"
        });

    }


    // BLOCKERS IS OPTIONAL

    if (
        blockers !== undefined &&
        blockers !== null &&
        typeof blockers !== "string"
    ) {

        return res.status(400).json({
            message: "Blockers must be valid text"
        });

    }


    next();

};


// ==========================================
// EXPORT VALIDATION
// ==========================================

module.exports = {
    validateSite,
    validateReport
};