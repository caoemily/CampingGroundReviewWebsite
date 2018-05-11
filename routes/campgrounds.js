var express = require("express"),
router = express.Router({mergeParams:true}),
middleware = require("../middleware"),
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

router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCamp = {name:name, price:price, image:image, description, author: author};
    Campground.create(newCamp, function(err, campground){
        if(err){
            console.log(err);
        }
        else{
            req.flash("success", "Campground added successfully.");
            res.redirect("/campgrounds");
        }
    });
});

router.get("/new",  middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

router.get("/:id", function(req, res) {
    //here see the example of get.../:animal 
    //get the id by req.params.id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp){
        if(err || !foundCamp) {
            req.flash("error", "Campground not found.");
            res.redirect("back");
        }
        else{
            res.render ("campgrounds/show", {campground:foundCamp}); 
        }
    });
});

router.get("/:id/edit",  middleware.checkCampOwner, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCamp){
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds/edit", {campground:foundCamp});
        }
    });
});

router.put("/:id",  middleware.checkCampOwner, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCamp){
        if(err){
            res.redirect("/campgrounds");
        }
        else{
            req.flash("success", "Campground edited successfully.");
            res.redirect("/campgrounds/" + req.params.id);
        }
    }); 
});

router.delete("/:id",  middleware.checkCampOwner, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        }
        else{
            req.flash("success", "Campground deleted successfully.");
            res.redirect("/campgrounds");
        }
    });
});

module.exports=router;