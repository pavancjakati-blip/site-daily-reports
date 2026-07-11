const errorHandler = (err, req, res, next) => {

    console.error("ERROR:", err);


    // ==========================================
    // DUPLICATE DATA
    // ==========================================

    if (err.code === "23505") {

        return res.status(409).json({
            message: "Duplicate data already exists"
        });

    }


    // ==========================================
    // FOREIGN KEY ERROR
    // ==========================================

    if (err.code === "23503") {

        return res.status(400).json({
            message: "Related record does not exist"
        });

    }


    // ==========================================
    // INVALID DATA FORMAT
    // ==========================================

    if (err.code === "22P02") {

        return res.status(400).json({
            message: "Invalid data format"
        });

    }


    // ==========================================
    // SERVER ERROR
    // ==========================================

    return res.status(500).json({
        message: "Internal Server Error"
    });

};


module.exports = errorHandler;