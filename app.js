var express = require("express"),
    request = require('request'),
    bodyParser = require("body-parser"),
    app = express(),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user");
    // seedDB = require("./seeds"),
    
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");

//seedDB();    
mongoose.connect("mongodb://localhost/yelp_camp");
app.use(express.static(__dirname+"/public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));

//Passport configuraton
app.use(require("express-session")({
    secret:"Emily home is far from here",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
    res.locals.user = req.user;
    next();
});

//use the routes
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server is listening");
});