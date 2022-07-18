const router = require("express").Router();
const City = require("../models/City.model");
const isLoggedIn = require("../middleware/isLoggedIn");
const fileUploader = require('../config/cloudinary.config');

/* GET home page */
router.get("/", (req, res, next) => {
    City.find()
      .then( citiesArr => {
        res.render("index", {citysArr: citiesArr});
        })
        
      .catch( (error) => {
        console.log("Error getting data from DB", error);
        next(error);
      })
    })



module.exports = router;
