const router = require("express").Router()
const Activity = require("../models/Activity.model")
const City = require("../models/City.model")
const User = require("../models/User.model")

router.get("/", (req, res, next) => {
    Activity.find()
        .populate("city")
        .then(dataFromDB => {
            res.render("activities/activities", {activities: dataFromDB})
        })
        .catch(err => {
            console.log("An error has occurred while rendering activities: " + err)
            next(err)
        })
})

router.get("/create", (req, res, next) => {
    City.find()
        .then(dataFromDB => {
            res.render("activities/create-activity", {cities: dataFromDB})
        })
})

router.post("/create", (req, res, next) => {
    const {name, country, description, location, city} = req.body
    Activity.create({name, country, description, location, city})
        .then(() => {
            res.redirect("/activities")
        })
        .catch(err => {
            console.log("An error has occurred while creating a new activity: " + err);
            next(err)
        })
})

router.get("/:id", (req, res, next) => {

})

router.get("/:id/edit", (req, res, next) => {
    
})

router.post("/:id/edit", (req, res, next) => {
    
})

router.post("/:id/delete", (req, res, next) => {
    
})

module.exports = router