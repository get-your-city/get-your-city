const router = require("express").Router()
const Activity = require("../models/Activity.model")
const City = require("../models/City.model")
const isLoggedIn = require("../middleware/isLoggedIn")

router.get("/", (req, res, next) => {
    const {cityId} = req.query
    let city
    City.findById(cityId)
        .then(cityFromDB => {
            city = cityFromDB
        })
    Activity.find({city: cityId})
        .populate("city")
        .then(activitiesFromDB => {
            res.render("activities/activities", {activities: activitiesFromDB, city: city})
        })
        .catch(err => {
            console.log("An error has occurred while rendering activities: " + err)
            next(err)
        })
})

router.get("/create", isLoggedIn, (req, res, next) => {
    const {cityId} = req.query
    City.findById(cityId)
        .then(city => {
            console.log("city: " + city);
            res.render("activities/create-activity", city)
        })
        .catch(err => {
            console.log("An error occurred while loading city: " + err);
            next(err)
        })
})

router.post("/create", isLoggedIn, validateActivityInput, (req, res, next) => {
    console.log(req.body);
    const {name, description, location, city} = req.body
    Activity.create({
        name: name,
        description: description || "no description",
        location: location || "no location",
        city: city
    })
        .then(() => {
            res.redirect("/activities")
        })
        .catch(err => {
            console.log("An error has occurred while creating a new activity: " + err);
            next(err)
        })
})

router.get("/:activityId/edit", isLoggedIn, (req, res, next) => {
    const {activityId} = req.params
    Activity.findById(activityId)
        .populate("city")
        .then(activity => {
            res.render("activities/edit-activity", activity)
        })
        .catch(err => {
            console.log("Error while rendering edit page of activity: " + err);
            next(err)
        })        
})

router.post("/:activityId/edit", isLoggedIn, validateActivityInput, (req, res, next) => {
    const {activityId} = req.params
    const {name, description, location, city} = req.body
    const updatedActivityData = {
        name: name,
        description: description || "no description",
        location: location || "no location",
        city: city
    }
    Activity.findByIdAndUpdate(activityId, updatedActivityData)
        .then(() => {
            res.redirect("/cities/" + updatedActivityData.city)
        })
        .catch(err => {
            console.log("Error while editing activity: " + err);
            next(err)
        })        
})

router.post("/:activityId/delete", isLoggedIn, (req, res, next) => {
    const {activityId} = req.params
    const {name, country, description, location, city} = req.body
    Activity.findByIdAndDelete(activityId)
        .then(() => {
            res.redirect("/activities")
        })
        .catch(err => {
            console.log("Error while editing activity: " + err);
            next(err)
        })
})

function validateActivityInput(req, res, next){
    if (!req.body.name){
        return res.send("Please fill all required fields.")
    }
    next()
}

module.exports = router