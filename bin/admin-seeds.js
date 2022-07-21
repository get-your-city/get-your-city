const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const saltRounds = 10;
const User = require('../models/User.model');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost/get-your-city';

const passwordIvona = "12345aA.";
const passwordMichael = "Preussie70+"

let promises = [];
[passwordIvona, passwordMichael].forEach(password => {
  promises.push(bcrypt
    .genSalt(saltRounds)
    .then((salt) => {
      console.log(salt, password);
      console.log(bcrypt.hash(password, salt))
      return bcrypt.hash(password, salt)
    })
  )
})

Promise.all(promises)
  .then(hashedPasswords => {
    console.log("hash:", hashedPasswords);
    const admins = [
      {
        username: "Ivona2",
        password: hashedPasswords[0],
        isAdmin: true
      },
      {
        username: "Michael",
        password: hashedPasswords[1],
        isAdmin: true
      }
    ]
    console.log(admins);

    mongoose
      .connect(MONGO_URI)
      .then((x) => {
        console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
      })

    User.create(admins)
      .then(newAdmins => {
        console.log("New admins added to the website:", newAdmins.length);
        // Once created, close the DB connection
        mongoose.connection.close();
      })
      .catch((err) => {
        console.log(`An error occurred while creating books from the DB: ${err}`)
      });
  })
