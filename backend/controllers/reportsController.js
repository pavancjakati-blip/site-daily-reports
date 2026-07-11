const pool = require("../db");


// ==========================================
// GET ALL REPORTS FOR A SITE
// ==========================================

const getReportsBySite = async (req, res, next) => {

    try {

        const {
            id
        } = req.params;


        // CHECK IF SITE EXISTS

        const siteResult = await pool.query(
            `SELECT id
             FROM sites
             WHERE id = $1`,
            [id]
        );


        if (siteResult.rows.length === 0) {

            return res.status(404).json({
                message: "Site not found"
            });

        }


        // GET REPORTS

        const result = await pool.query(
            `SELECT *
             FROM daily_reports
             WHERE site_id = $1
             ORDER BY report_date DESC`,
            [id]
        );


        return res.status(200).json(
            result.rows
        );

    } catch (error) {

        next(error);

    }

};


// ==========================================
// GET REPORT BY DATE
// ==========================================

const getReportByDate = async (req, res, next) => {

    try {

        const {
            id,
            date
        } = req.params;


        const result = await pool.query(
            `SELECT *
             FROM daily_reports

             WHERE site_id = $1
             AND report_date = $2`,
            [
                id,
                date
            ]
        );


        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Report not found"
            });

        }


        return res.status(200).json(
            result.rows[0]
        );

    } catch (error) {

        next(error);

    }

};


// ==========================================
// CREATE DAILY REPORT
// ==========================================

const createReport = async (req, res, next) => {

    try {

        const {
            id
        } = req.params;


        const {
            report_date,
            workers_present,
            work_done,
            blockers,
            submitted_by
        } = req.body;


        // ==========================================
        // CHECK SITE EXISTS
        // ==========================================

        const siteResult = await pool.query(
            `SELECT id
             FROM sites
             WHERE id = $1`,
            [id]
        );


        if (siteResult.rows.length === 0) {

            return res.status(404).json({
                message: "Site not found"
            });

        }


        // ==========================================
        // CHECK DUPLICATE REPORT
        // ==========================================

        const duplicateReport = await pool.query(
            `SELECT id
             FROM daily_reports

             WHERE site_id = $1
             AND report_date = $2`,
            [
                id,
                report_date
            ]
        );


        if (duplicateReport.rows.length > 0) {

            return res.status(409).json({
                message: "A report for this date already exists"
            });

        }


        // ==========================================
        // INSERT REPORT
        // ==========================================

        const result = await pool.query(
            `INSERT INTO daily_reports
            (
                site_id,
                report_date,
                workers_present,
                work_done,
                blockers,
                submitted_by
            )

            VALUES ($1, $2, $3, $4, $5, $6)

            RETURNING *`,
            [
                id,
                report_date,
                workers_present,
                work_done.trim(),
                blockers
                    ? blockers.trim()
                    : null,
                submitted_by.trim()
            ]
        );


        return res.status(201).json({
            message: "Report submitted successfully",
            report: result.rows[0]
        });

    } catch (error) {

        next(error);

    }

};


// ==========================================
// EXPORT CONTROLLERS
// ==========================================

module.exports = {
    getReportsBySite,
    getReportByDate,
    createReport
};