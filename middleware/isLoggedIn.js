module.exports = (req, res, next) => {
  if (!req.session.user) {
    req.session.redirectTo = req.path
    return res.redirect("/auth/login");
  }
  req.user = req.session.user;
  next();
};
