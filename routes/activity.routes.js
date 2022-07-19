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
            console.log(cityId, city, cityFromDB, req.query)
        })
    Activity.find({city})
        .populate("city")
        .then(activitiesFromDB => {
            res.render("activities/activities", {activities: activitiesFromDB, city})
        })
        .catch(err => {
            console.log("An error has occurred while rendering activities: " + err)
            next(err)
        })
})

router.get("/create", isLoggedIn, (req, res, next) => {
    const {id} = req.body
    City.findById(id)
        .then(city => {
            console.log(city)
            res.render("activities/create-activity", {city})
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
            cities = cities.filter(city => city.name !== activity.city.name)
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