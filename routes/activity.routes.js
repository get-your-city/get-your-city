const router = require("express").Router()
const Activity = require("../models/Activity.model")
const City = require("../models/City.model")
const isLoggedIn = require("../middleware/isLoggedIn")
const validateActivityInput = require("../middleware/validateActivityInput")

router.get("/cities/:cityId/activities", (req, res, next) => {
    const { cityId } = req.params
    Promise.all([
        City.findById(cityId),
        Activity.find({ city: cityId }).populate("city")
    ])
        .then(values => {
            const [cityFromDB, activitiesFromDB] = values
            res.render("activities/activities", { activities: activitiesFromDB, city: cityFromDB })
        })
        .catch(err => {
            console.log("An error has occurred while rendering activities: " + err)
            next(err)
        })
})

router.get("/cities/:cityId/activities/create", isLoggedIn, (req, res, next) => {
    const { cityId } = req.params
    City.findById(cityId)
        .then(city => {
            res.render("activities/create-activity", city)
        })
        .catch(err => {
            console.log("An error occurred while loading city: " + err);
            next(err)
        })
})

router.post("/cities/:cityId/activities/create", isLoggedIn, validateActivityInput, (req, res, next) => {
    const { name, description, location, city } = req.body
    Activity.create({
        name: name,
        description: description,
        location: location,
        city: city
    })
        .then(() => {
            res.redirect(`/cities/${city}/activities`)
        })
        .catch(err => {
            console.log("An error has occurred while creating a new activity: " + err);
            next(err)
        })
})

router.get("/cities/:cityId/activities/:activityId/edit", isLoggedIn, (req, res, next) => {
    const { activityId } = req.params
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

router.post("/cities/:cityId/activities/:activityId/edit", isLoggedIn, validateActivityInput, (req, res, next) => {
    const { activityId } = req.params
    const { name, description, location, city } = req.body
    const updatedActivityData = {
        name: name,
        description: description,
        location: location,
        city: city
    }
    Activity.findByIdAndUpdate(activityId, updatedActivityData)
        .then(() => {
            res.redirect(`/cities/${updatedActivityData.city}/activities`)
        })
        .catch(err => {
            console.log("Error while editing activity: " + err);
            next(err)
        })
})

router.post("/cities/:cityId/activities/:activityId/delete", isLoggedIn, (req, res, next) => {
    const { cityId, activityId } = req.params
    Activity.findByIdAndDelete(activityId)
        .then(() => {
            res.redirect(`/cities/${cityId}/activities`)
        })
        .catch(err => {
            console.log("Error while editing activity: " + err);
            next(err)
        })
})

module.exports = router
