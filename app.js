require("babel-register");
require("babel-polyfill");

const express = require("express");
const graphqlHTTP = require("express-graphql");
const mongoose = require("mongoose");
const passport = require("passport");
const authenticate = require("./authenticate");
const cors = require("cors");
const bodyParser = require("body-parser");

const User = require("./models/user");
const schema = require("./graphql/schema");
const resolver = require("./graphql/resolver");
const config = require("./config/keys");

const app = express();

app.options("*", cors());

var allowedOrigins = [
  "http://localhost",
  "http://localhost:3000",
  "http://localhost:3001",
  "https://shayarifrontend.herokuapp.com/",
  "https://shayarifrontend.herokuapp.com/*",
  "//*.herokuapp.com:*/*"
];

app.use(
  cors({
    origin: function(origin, callback) {
      // allow requests with no origin
      // (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          "The CORS policy for this site does not " +
          "allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    }
  })
);

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());

app.post("/signup", (req, res) => {
  User.register(
    new User({ email: req.body.email }),
    req.body.password,
    (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ err: err });
      } else {
        passport.authenticate("local")(req, res, () => {
          const token = authenticate.generateToken({ _id: user._id });

          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({ token: token, status: "Sucessfully Registered!" });
        });
      }
    }
  );
});

app.post("/login", passport.authenticate("local"), (req, res) => {
  const token = authenticate.generateToken({ _id: req.user._id });

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.json({ token: token, status: "Sucessfully Logged In!" });
});

app.use(
  "/graphql",
  authenticate.verifyUser,
  graphqlHTTP({
    schema,
    rootValue: resolver,
    graphiql: true
  })
);

mongoose.connect(config.MONGO_URI, { useNewUrlParser: true }, err => {
  if (err) console.log(err.message);
  else console.log("MongoDB Successfully Connected ...");
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server started on http://localhost:3000`);
});
