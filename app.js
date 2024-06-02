if(process.env.NODE_ENV != "production"){
  require('dotenv').config();

}
const express = require('express');
const path = require('path');
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const passport = require("passport");
const flash = require('express-flash');
const LocalStrategy = require("passport-local");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');
const passportLocalMongoose = require('passport-local-mongoose');
const app = express();
const User = require("./models/user.js");
const Listing = require("./models/listing.js"); 
require('dotenv').config();

const dburl = "mongodb+srv://jgarg8440:SQgFJq8XGKIySBSr@moviesdb.afwje0i.mongodb.net/?retryWrites=true&w=majority&appName=moviesdb";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dburl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(flash());

app.use((req, res, next) => {
  res.locals.curruser = req.user;
  next();
});


const store = MongoStore.create({
  mongoUrl: dburl,
  crypto: {
    secret: process.env.SECRET,
    touchAfter: 24 * 3600,
  },
});


app.use(session({
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  } else {
    res.render('root');
  }
});

app.get('/listing', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.redirect("/login");
    }
    const movies = await Listing.find();
    const isPublic = false; 
    res.render('listing', { movies: movies, isPublic: isPublic }); 
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).send("An error occurred while fetching movies.");
  }
});

app.post("/addMovieToListing", async (req, res) => {
  const { title, year, writer, actors, poster } = req.body; 
  try {
    const newMovie = new Listing({ title, year, writer, actors, poster });
    await newMovie.save();
    res.json({ message: 'Movie added to listing successfully.', movie: newMovie });
  } catch (error) {
    console.error('Error adding movie to listing:', error);
    res.status(500).send("An error occurred while adding the movie to the listing.");
  }
});

app.post("/deleteMovieFromListing", async (req, res) => {
  const { movieId } = req.body;
  try {
    const deletedMovie = await Listing.findByIdAndDelete(movieId);
    if (!deletedMovie) {
      return res.status(404).json({ message: 'Movie not found.' });
    }
    res.redirect("/listing");
  } catch (error) {
    console.error('Error deleting movie from listing:', error);
    res.status(500).send("An error occurred while deleting the movie from the listing.");
  }
});

app.get('/public-listing', async (req, res) => {
  try {
    const movies = await Listing.find();
    const isPublic = true; 
    res.render('listing', { movies, isPublic });
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).send("An error occurred while fetching movies.");
  }
});

app.get('/check-authentication', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).send('Authenticated');
  } else {
    res.status(401).send('Not authenticated');
  }
});

app.get('/private-listing', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.render('private');
  } else {
    res.redirect('public-listing'); 
  }
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signup", async (req, res) => {
  let { username, email, password } = req.body;
  try {
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    res.redirect("/login");
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).send("An error occurred during signup.");
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), async (req, res) => {
  res.redirect("/");
});

app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
