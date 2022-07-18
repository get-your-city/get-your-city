const router = require("express").Router()
const Activity = require("../models/Activity.model")
const City = require("../models/City.model")
const User = require("../models/User.model")
const isLoggedIn = require("../middleware/isLoggedIn")

function getCityById(req, res, next){
    const {cityId} = req.params
    City.findById(cityId)
        .then(cityFromDB => {
            req.city = cityFromDB
            next()
        })
        .catch(err => {
            console.log("An error occurred while loading city from DB: " + err)
            next()
        })
}

router.get("/", (req, res, next) => {
    const {city} = req.query
    Activity.find({city})
        .populate("city")
        .then(activitiesFromDB => {
            res.render("activities/activities", {activities: activitiesFromDB})
        })
        .catch(err => {
            console.log("An error has occurred while rendering activities: " + err)
            next(err)
        })
})

router.get("/create", isLoggedIn, (req, res, next) => {
    City.find()
        .then(dataFromDB => {
            res.render("activities/create-activity", {cities: dataFromDB})
        })
})

router.post("/create", isLoggedIn, validateActivityInput, (req, res, next) => {
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

router.get("/:activityId", (req, res, next) => {
    const {activityId} = req.params
    Activity.findById(activityId)
        .populate("city")
        .then(activity => {
            res.render("activities/activity", activity)
        })
        .catch(err => {
            console.log("Error while rendering activity: " + err);
            next(err)
        })
})

router.get("/:activityId/edit", isLoggedIn, (req, res, next) => {
    let cities
    City.find()
        .then(citiesFromDB => {
            cities = citiesFromDB
        })
        .catch(err => {
            console.log("Error while loading cities: " + err);
            next(err)
        })        
    const {activityId} = req.params
    Activity.findById(activityId)
        .populate("city")
        .then(activity => {
            res.render("activities/edit-activity", {activity, cities})
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
    Activity.findByIdAndUpdate(activityId, {updatedActivityData})
        .then(() => {
            res.redirect("/activities/" + activityId)
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
    if (!(req.body.name && req.body.city)){
        return res.send("Please fill all required fields.")
    }
    next()
}

module.exports = router