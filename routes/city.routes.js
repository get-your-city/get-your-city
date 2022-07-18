const router = require("express").Router();
const City = require("../models/City.model");
const isLoggedIn = require("../middleware/isLoggedIn");
const fileUploader = require('../config/cloudinary.config');

// CREATE: Render form
    router.get("/create", (req, res, next) => {
        res.render("cities/cities-create");
      })
  
  // CREATE: Process form
  router.post("/create", isLoggedIn, fileUploader.single('cityImage'), (req, res, next) => {
    console.log("here to create city.....................................")
    const cityDetails = {
      name: req.body.name,
      country: req.body.country,
      description: req.body.description,
      imageUrl: req.file.path || undefined
    };
  
    City.create(cityDetails)
      .then( () => {
        console.log("before redirecting..............................");
        res.redirect("/");
      })
      .catch( (error) => {
        console.log("Error adding city in the DB", error);
        next(error);
      })
  })
  
  
  // UPDATE:
  router.get("/:cityId/edit", isLoggedIn, (req, res, next) => {
    const {cityId} = req.params;
  
    City.findById(cityId)
      .then( (cityDetails) => {
        res.render("cities/cities-edit", cityDetails);
      })
      .catch( (error) => {
        console.log("Error getting city details from DB", error);
        next(error);
      })
  });
  
  
  // UPDATE:
  router.post("/:cityId/edit", isLoggedIn, (req, res, next) => {
  
    const cityId = req.params.cityId;
  
    const newDetails = {
      name: req.body.name,
      country: req.body.country,
      description: req.body.description,
    }
  
    City.findByIdAndUpdate(cityId, newDetails)
      .then( () => {
        res.redirect("/");
      })
      .catch( (error) => {
        console.log("Error updating city in DB", error);
        next(error);
      })
  });
  
  
  // DELETE city
  router.post("/:cityId/delete", isLoggedIn, (req, res, next) => {
    const {cityId} = req.params;
  
    City.findByIdAndRemove(cityId)
      .then( () => {
        res.redirect('/');
      })
      .catch( (error) => {
        console.log("Error deleting city from DB", error);
        next(error);
      })
  
  })

  module.exports = router