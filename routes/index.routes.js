const router = require("express").Router();
const City = require("../models/City.model");

/* GET home page */
router.get("/", (req, res, next) => {
    City.find()
      .then( citiesArr => {
        res.render("index", {citiesArr});
        })
        
      .catch( (error) => {
        console.log("Error getting data from DB", error);
        next(error);
      })
    })

module.exports = router;
