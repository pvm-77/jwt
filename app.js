
require("dotenv").config();
require("./config/database").connect();
const express = require("express");

const app = express();
const mongoose = require("mongoose");
// bcryt
const bcrypt = require("bcryptjs");
// jwt
const jwt = require("jsonwebtoken");

app.use(express.json());

// Logic goes here
const User = require("./model/user");
const auth = require("./middleWare/auth");

app.post("/welcome", auth, (req, res) => {
  res.status(200).send("Welcome 🙌 ");
});
// register user
app.post('/register', async (req, res) => {
    // step 1: get user input
    // step 2: validate user input
    // step 3 : check if user already exists
    // step 4: encrypt password
    // step 5: save user to database
    // step 6: create signed jwt token
    // Our register logic starts here
    try {
        // Get user input
        const { fullname, email, password } = req.body;

        // Validate user input
        if (!(email && password && fullname)) {
            res.status(400).send("All input is required");
        }

        // check if user already exist
        const olduser = await User.findOne({ email });
        if (olduser) {
            res.status(400).send("User already exists");
        }

        // Validate if user exist in our database


        //Encrypt user password
        encryptedPassword = await bcrypt.hash(password, 10);

        // Create user in our database
        const user = await User.create({
            fullname,
            email: email.toLowerCase(), // sanitize: convert email to lowercase
            password: encryptedPassword,
        });

        // Create token
        const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );
        // save user token
        user.token = token;

        // return new user
        res.status(201).json(user);
    } catch (err) {
        console.log(err);
    }


});
function isEmpty(field) {
    // check if field is empty
    if (field === "") {
        return true;
    }
    return false;
}
// app.post('/login', async (req, res) => {

//     try {
//         // validate user input
//         const { email, password } = req.body;
//         if (isEmpty(email) || isEmpty(password)) {
//             res.status(400).send("All input is required");
//         }
//         // check if user is in database
//         const user = await User.findOne({ email });
//         if (!user) {
//             res.status(400).send("User does not exist");
//         }
//         // check if password is correct
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             res.status(400).send("Incorrect password");
//         }
//         // create token
//         const token = jwt.sign(
//             { user_id: user._id, email },
//             process.env.TOKEN_KEY,
//             {
//                 expiresIn: "2h",
//             }
//         );
//         // save user token
//         user.token = token;
//         // return new user
//         res.status(200).json(user);

//     } catch (error) {
//         console.log(error);
//     }






// });

app.post("/login", async (req, res) => {

    // Our login logic starts here
    try {
      // Get user input
      const { email, password } = req.body;
  
      // Validate user input
      if (!(email && password)) {
        res.status(400).send("All input is required");
      }
      // Validate if user exist in our database
      const user = await User.findOne({ email });
  
      if (user && (await bcrypt.compare(password, user.password))) {
        // Create token
        const token = jwt.sign(
          { user_id: user._id, email },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );
  
        // save user token
        user.token = token;
  
        // user
        res.status(200).json(user);
      }
      res.status(400).send("Invalid Credentials");
    } catch (err) {
      console.log(err);
    }
    // Our register logic ends here
  });

  
  

module.exports = app;