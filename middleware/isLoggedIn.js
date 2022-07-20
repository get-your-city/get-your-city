module.exports = (req, res, next) => {
  // console.log("path while checking login:", req.path);
  // console.log("session:", req.session);
  // console.log(req.method)
  // checks if the user is logged in when trying to access a specific page
  if (!req.session.user) {
    req.session.redirectTo = req.path
    return res.redirect("/auth/login");
  }
  req.user = req.session.user;
  next();
};
