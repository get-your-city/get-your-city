const router = require("express").Router();
const City = require("../models/City.model");
const isLoggedIn = require("../middleware/isLoggedIn");
const fileUploader = require('../config/cloudinary.config');
const axios = require("axios").default

// READ: Single city
router.get("/:cityId", (req, res, next) => {
    const {cityId} = req.params
    City.findById(cityId)
        .then(cityFromDB => {
          axios.get(`https://api.weatherapi.com/v1/current.json?key=15bbca2250624ffd9b882647221907&q=${cityFromDB.name}&aqi=yes`)
            .then(dataFromAPI => {
              const weather = {
                temperature: dataFromAPI.data.current.temp_c,
                condition: dataFromAPI.data.current.condition.text,
                icon: dataFromAPI.data.current.condition.icon
              }
              res.render("cities/city", {city: cityFromDB, weather: weather})
            })
            .catch(err => {
              console.log("An error occurred while retrieving weather data from API: " + err)
              const weather = {
                temperature: "-",
                condition: "-",
                icon: ""
              }
              res.render("cities/city", {city: cityFromDB, weather: weather})
            })
        })
        .catch(err => {
            console.log("An error has occurred while loading city from DB: " + err);
            next()
        })
})

// CREATE: Render form
    router.get("/create", (req, res, next) => {
        res.render("cities/cities-create");
      })
  
  // CREATE: Process form
  router.post("/create", isLoggedIn, fileUploader.single('cityImage'), (req, res, next) => {
    if (!(req.body.name && req.body.country && req.file)){
      return res.send("Please fill all required fields.")
    }
    const cityDetails = {
      name: req.body.name,
      country: req.body.country,
      description: req.body.description || "no description",
      imageUrl: req.file.path
    };
    City.create(cityDetails)
      .then( () => {
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
  router.post("/:cityId/edit", isLoggedIn, fileUploader.single('cityImage'), (req, res, next) => {
    const cityId = req.params.cityId;
    if (!(req.body.name && req.body.country)){
      return res.send("Please fill all required fields.")
    }
    const newDetails = {
      name: req.body.name,
      country: req.body.country,
      description: req.body.description || "no description"
    }
    if (req.file){
      newDetails.imageUrl = req.file.path
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