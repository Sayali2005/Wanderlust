const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js")

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url:String,
    filename:String,
    // filename:  {
    //     type: String,
    //     required: false,  // Make filename optional
    // },
    // url: {
    //   type: String,
    //   default:
    //     "https://plus.unsplash.com/premium_photo-1724818361335-291394c25925?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    // },
  },
  price: Number,
  location: String,
  country: String,
  reviews : [
    {
      type:Schema.Types.ObjectId,
      ref:"Review",
    },
  ],
  owner : {
    type : Schema.Types.ObjectId,
    ref : "User",
  },
  geometry : {
    type: {
      type: String,
      enum : ['Point'],
      required: true
    },
    coordinates: {
      type : [Number],
      required: true
  } 
  },
  category: {
    type: String,
    enum: ["Trending", "Rooms", "Iconic Cities", "Mountains", "Castles", "Amazing Pools", "Camping", "Farms", "Arctic", "Domes", "Boats"],
  }
  // geometry : {
  //   type: {
  //     type: String,
  //     enum : ['Point'],
  //     required: true
  //   },
  //   coordinates: {
  //     type : [Number],
  //     required: true
  // } 
  // }
  
});
//when listing is deleted ,corresponding reviews are also deldeted!
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
      await Review.deleteMany({_id : {$in :listing.reviews}});
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
