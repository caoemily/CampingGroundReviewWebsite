var express = require("express"),
router = express.Router({mergeParams:true}),
Campground = require("../models/campground");

router.get("/", function(req, res){
    Campground.find({}, function(err, campgrounds){
        if(err) {
            console.log(err);
        }
        else {
            res.render("campgrounds/index", {campgrounds:campgrounds});
        }
    });
});

router.post("/", function(req, res){
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

router.get("/new", function(req, res){
    res.render("campgrounds/new");
});

router.get("/:id", function(req, res) {
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

module.exports=router;