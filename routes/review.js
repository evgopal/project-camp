const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utilities/wrapAsync");
const Campground = require("../models/campground");
const Review = require("../models/review");
const ExpressError = require("../utilities/expressError");
const Joi = require("joi");

const validateReviews = (req, res, next) => {
    const reviewSchema = Joi.object({
      review: Joi.object({
        rating: Joi.number().required(),
        body: Joi.string().required(),
      }).required(),
    });
    const { error } = reviewSchema.validate(req.body);
    if (error) {
      const msg = error.details.map((el) => el.message);
      throw new ExpressError(msg, 400);
    } else {
      next();
    }
  };


router.post(
    "/",
    validateReviews,
    wrapAsync(async (req, res) => {
      const campground = await Campground.findById(req.params.id);
      const review = new Review(req.body.review);
      campground.reviews.push(review);
      await review.save();
      await campground.save();
      req.flash('success', 'Created new review!');
      res.redirect(`/campgrounds/${campground._id}`);
    })
  );
  
  router.delete('/:reviewId', wrapAsync(async(req,res) => {
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Deleted review!');
    res.redirect(`/campgrounds/${id}`);
  
  }))


  module.exports = router;