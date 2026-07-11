const pool = require("../db");


// ==========================================
// GET ALL SITES
// ==========================================

const getAllSites = async (req, res, next) => {

    try {

        const result = await pool.query(
            `SELECT *
             FROM sites
             ORDER BY created_at DESC`
        );


        return res.status(200).json(
            result.rows
        );

    } catch (error) {

        next(error);

    }

};


// ==========================================
// CREATE SITE
// ==========================================

const createSite = async (req, res, next) => {

    try {

        const {
            name,
            location
        } = req.body;


        const result = await pool.query(
            `INSERT INTO sites
            (
                name,
                location
            )

            VALUES ($1, $2)

            RETURNING *`,
            [
                name.trim(),
                location.trim()
            ]
        );


        return res.status(201).json({
            message: "Site created successfully",
            site: result.rows[0]
        });

    } catch (error) {

        next(error);

    }

};


// ==========================================
// EXPORT CONTROLLERS
// ==========================================

module.exports = {
    getAllSites,
    createSite
};