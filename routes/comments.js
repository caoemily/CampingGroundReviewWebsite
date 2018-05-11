var express = require("express"),
router = express.Router({mergeParams:true}),
Campground = require("../models/campground"),
middleware = require("../middleware"),
Comment = require("../models/comment");

router.get("/new", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground){
        if(err) {
            console.log(err);
        }
        else{
            res.render("comments/new", {campground:campground});
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res){
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
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //same comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Comment added successfully.");
                    res.redirect("/campgrounds/"+ req.params.id);
                }
            });
        }
    });
});

router.get("/:comment_id/edit", middleware.checkCommentOwner, function(req, res){
    Campground.findById(req.params.id, function(err, foundcampground) {
        if(err || !foundcampground){
            req.flash("error", "No campground found.");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            }
            else{
                res.render("comments/edit", {campground_id:req.params.id, comment:foundComment});
            }
        });
    });
});

router.put("/:comment_id", middleware.checkCommentOwner, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updateComment){
        if(err){
            res.redirect("back");
        }
        else{
            req.flash("success", "Comment edited successfully.");
            res.redirect("/campgrounds/" + req.params.id)
        }
    });
});

router.delete("/:comment_id", middleware.checkCommentOwner, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        }
        else{
            req.flash("success", "Comment deleted successfully.");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});



module.exports=router;