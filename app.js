var express = require("express"),
    request = require('request'),
    bodyParser = require("body-parser"),
    app = express(),
    mongoose = require("mongoose"),
    Comment = require("./models/comment"),
    seedDB = require("./seeds"),
    Campground = require("./models/campground");

//seedDB();    
mongoose.connect("mongodb://localhost/yelp_camp");
app.use(express.static(__dirname+"/public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req, res){
   res.render("landing");
});

app.get("/campgrounds", function(req, res){
    Campground.find({}, function(err, campgrounds){
        if(err) {
            console.log(err);
        }
        else {
            res.render("campgrounds/index", {campgrounds:campgrounds});
        }
    });
});

app.post("/campgrounds", function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCamp = {name:name, image:image, description};
    //campgrounds.push(newCamp);
    //create new campground to database
    Campground.create(newCamp, function(err, campground){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/campgrounds");
        }
    });
});

app.get("/campgrounds/new", function(req, res){
    res.render("campgrounds/new");
});

app.get("/campgrounds/:id", function(req, res) {
    //here see the example of get.../:animal 
    //get the id by req.params.id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp){
        if(err) {
            console.log(err);
        }
        else{
            res.render ("campgrounds/show", {campground:foundCamp}); 
        }
    });
});

app.get("/campgrounds/:id/comments/new", function(req, res) {
    Campground.findById(req.params.id, function(err, campground){
        if(err) {
            console.log(err);
        }
        else{
            res.render("comments/new", {campground:campground});
        }
    });
});

app.post("/campgrounds/:id/comments", function(req, res){
    Campground.findById(req.params.id, function(err, campground) {
        if(err){
            console.log(err);
            res.redirect("/campgrounds/"+ req.params.id);
        }
        else{
            Comment.create(req.body.comment, function(err, comment) {
                if(err){
                    console.log(err);
                }
                else{
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/"+ req.params.id);
                }
            });
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server is listening");
});