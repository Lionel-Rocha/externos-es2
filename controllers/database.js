const express = require("express");
const router = express.Router();
const databaseUtils = require("../repositories/database");

router.get("/restaurarBanco", async (req, res) => {
   await databaseUtils.restoresDatabase();
    res.status(200).send("Banco restaurado");
});


module.exports = router;