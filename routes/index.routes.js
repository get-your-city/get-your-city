const router = require("express").Router();
const City = require("../models/City.model");

/* GET home page */

// READ: List of all citys
router.get("/citys", (req, res, next) => {
    City.find()
      .then( citysArr => {
        res.render("auth/citys", {citysArr});
        })
        
      .catch( (error) => {
        console.log("Error getting data from DB", error);
        next(error);
      })
    })


    // CREATE: Render form
router.get("/auth/create", (req, res, next) => {
      res.render("auth/citys-create");
    })

// CREATE: Process form
router.post("/auth/create", (req, res, next) => {

  const cityDetails = {
    name: req.body.name,
    country: req.body.country,
    description: req.body.description,
    // image: req.body.image,
  };

  City.create(cityDetails)
    .then( () => {
      res.redirect("/citys");
    })
    .catch( (error) => {
      console.log("Error adding city in the DB", error);
      next(error);
    })
})

module.exports = router;
