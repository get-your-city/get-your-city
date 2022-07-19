module.exports = (req, res, next) => {
    if (!req.body.name){
        return res.send("Please fill all required fields.")
    }
    next()
}