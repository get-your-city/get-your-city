const router = require("express").Router();
const getPathForRedirection = require("../utils/getPathForRedirection")

// ! This use case is using a regular expression to control for special characters and min length
const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// How many rounds should bcrypt run the salt (default [10 - 12 rounds])
const saltRounds = 10;

// Require the User model in order to interact with the database
const User = require("../models/User.model");

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/signup", isLoggedOut, (req, res) => {
  res.render("auth/signup");
});  

router.post("/signup", isLoggedOut, (req, res) => {
  const { username, password } = req.body;

  if (!username) {
    return res.status(400).render("auth/signup", {
      errorMessage: "Please choose a username."
    });  
  }  

  if (!password) {
    return res.status(400).render("auth/signup", {
      errorMessage: "Please choose a password."
    });  
  }  

  if (password.length < 8) {
    return res.status(400).render("auth/signup", {
      errorMessage: "Your password needs to be at least 8 characters long."
    });  
  }  

  if (!regex.test(password)) {
    return res.status(400).render("auth/signup", {
      errorMessage:
        "Password needs to have at least 8 characters and must contain at least one number, one lowercase and one uppercase letter."
    });
  }

  // Search the database for a user with the username submitted in the form
  User.findOne({ username }).then((found) => {
    // If the user is found, send the message username is taken
    if (found) {
      return res
        .status(400)
        .render("auth/signup", { errorMessage: "Username already taken." });
    }

    // if user is not found, create a new user - start with hashing the password
    return bcrypt
      .genSalt(saltRounds)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hashedPassword) => {
        // Create a user and save it in the database
        return User.create({
          username,
          password: hashedPassword,
          isAdmin: false
        });
      })
      .then((user) => {
        // Bind the user to the session object
        req.session.user = user;

        // Get path for redirection
        const redirectTo = getPathForRedirection(req.session.redirectTo)

        res.redirect(redirectTo || "/");
      })
      .catch((error) => {
        if (error instanceof mongoose.Error.ValidationError) {
          return res
            .status(400)
            .render("auth/signup", { errorMessage: error.message });
        }
        if (error.code === 11000) {
          return res.status(400).render("auth/signup", {
            errorMessage:
              "Username need to be unique. The username you chose is already in use."
          });
        }
        return res
          .status(500)
          .render("auth/signup", { errorMessage: error.message });
      });
  });
});

router.get("/login", isLoggedOut, (req, res) => {
  res.render("auth/login");
});

router.post("/login", isLoggedOut, (req, res, next) => {
  const { username, password } = req.body;

  if (!username) {
    return res.status(400).render("auth/login", {
      errorMessage: "Please enter your username."
    });
  }

  if (!password) {
    return res.status(400).render("auth/login", {
      errorMessage: "Please enter your password."
    });
  }

  // Here we use the same logic as above
  // - either length based parameters or we check the strength of a password
  if (password.length < 8) {
    return res.status(400).render("auth/login", {
      errorMessage: "Your password is at least 8 characters long."
    });
  }

  if (!regex.test(password)) {
    return res.status(400).render("auth/login", {
      errorMessage:
        "Your password is at least 8 characters long and contains at least one number, one lowercase and one uppercase letter."
    });
  }

  // Search the database for a user with the username submitted in the form
  User.findOne({ username })
    .then((user) => {
      // If the user isn't found, send the message that user provided wrong credentials
      if (!user) {
        return res.status(400).render("auth/login", {
          errorMessage: "Wrong credentials."
        });
      }

      // If user is found based on the username, check if the in putted password matches the one saved in the database
      bcrypt.compare(password, user.password).then((isSamePassword) => {
        if (!isSamePassword) {
          return res.status(400).render("auth/login", {
            errorMessage: "Wrong credentials.",
          });
        }
        req.session.user = user;
        // req.session.user = user._id; // ! better and safer but in this case we saving the entire user object

        // Get path for redirection
        const redirectTo = getPathForRedirection(req.session.redirectTo)

        return res.redirect(redirectTo || "/");
      });
    })

    .catch((err) => {
      // in this case we are sending the error handling to the error handling middleware that is defined in the error handling file
      // you can just as easily run the res.status that is commented out below
      next(err);
      // return res.status(500).render("auth/login", { errorMessage: err.message });
    });
});

router.post("/logout", isLoggedIn, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .render("auth/logout", { errorMessage: err.message });
    }
    res.redirect("/");
  });
});

router.get("/update", isLoggedIn, (req, res, next) => {
  const user = req.session.user
  console.log("password of user while rendering update form:", user.password);
  res.render("auth/update", {user})
})

router.post("/update", isLoggedIn, (req, res, next) => {
  const {username, password, userId} = req.body
  
  if (!username) {
    return res.status(400).render("auth/update", {
      errorMessage: "Please choose a username."
    });  
  }  

  if (!password) {
    return res.status(400).render("auth/update", {
      errorMessage: "Please choose a password."
    });  
  }  

  if (password.length < 8) {
    return res.status(400).render("auth/update", {
      errorMessage: "Your password needs to be at least 8 characters long."
    });  
  }  

  if (!regex.test(password)) {
    return res.status(400).render("auth/update", {
      errorMessage:
        "Password needs to have at least 8 characters and must contain at least one number, one lowercase and one uppercase letter."
    });
  }

  // Search the database for a user with the username submitted in the form
  User.findById(userId).then((found) => {
    // If the user is not found, send the message that the user does not exist
    if (!found) {
      return res
        .status(400)
        .render("auth/update", { errorMessage: "This user does not exist." });
    }

    // if user is correctly identified, update user - start with hashing the password
    return bcrypt
      .genSalt(saltRounds)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hashedPassword) => {
        // Create a user and save it in the database
        return User.findByIdAndUpdate(userId, {
          username,
          password: hashedPassword,
          isAdmin: false
        }, {new: true});
      })
      .then((user) => {
        // Bind the user to the session object
        req.session.user = user;
        res.redirect("/");
      })
      .catch((error) => {
        if (error instanceof mongoose.Error.ValidationError) {
          return res
            .status(400)
            .render("auth/update", { errorMessage: error.message });
        }
        if (error.code === 11000) {
          return res.status(400).render("auth/update", {
            errorMessage:
              "Username need to be unique. The username you chose is already in use."
          });
        }
        return res
          .status(500)
          .render("auth/update", { errorMessage: error.message });
      });
  });
})

module.exports = router;
