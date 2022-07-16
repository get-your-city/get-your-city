const router = require("express").Router()
const Activity = require("../models/Activity.model")
const City = require("../models/City.model")
const User = require("../models/User.model")
const isLoggedIn = require("../middleware/isLoggedIn")

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

router.get("/create", isLoggedIn, (req, res, next) => {
    City.find()
        .then(dataFromDB => {
            res.render("activities/create-activity", {cities: dataFromDB})
        })
})

router.post("/create", isLoggedIn, (req, res, next) => {
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

router.post("/:activityId/edit", isLoggedIn, (req, res, next) => {
    const {activityId} = req.params
    const {name, country, description, location, city} = req.body
    Activity.findByIdAndUpdate(activityId, {name, country, description, location, city})
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

module.exports = router