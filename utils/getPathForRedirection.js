module.exports = path => {
    let redirectTo
    if (path) {
        if (path.slice(-6) === "delete") {
            redirectTo = "/"
        } else {
            redirectTo = path
        }
    } else {
        redirectTo = "/"
    }
    return redirectTo
}