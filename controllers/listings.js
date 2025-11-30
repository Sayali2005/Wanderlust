const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
  let { category, search } = req.query;
  let alllisting;

  if (category) {
    category = category.trim();
    console.log("Filtering by category:", category);
    alllisting = await Listing.find({ category });
  } else if (search) {
    search = search.trim();
    console.log("Searching for:", search);
    // Search in title, location, and country (case-insensitive)
    alllisting = await Listing.find({
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } }
      ]
    });
  } else {
    alllisting = await Listing.find({});
  }

  console.log("Listings found:", alllisting.length);
  res.render("listings/index.ejs", { alllisting });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" }, }).populate("owner");
  if (!listing) {
    req.flash("error", "Listing you are requested for does not exist!");
    return res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {

  try {
    const { location } = req.body.listing;

    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${req.body.listing.location}&format=json`);
    if (!response.ok) {
      req.flash("error", "Error fetching location data from OpenStreetMap!");
      return res.redirect("/listings/new");
    }
    const data = await response.json();

    if (!data.length) {
      req.flash("error", "Location not found!");
      return res.redirect("/listings/new");
    }

    const [lon, lat] = [parseFloat(data[0].lon), parseFloat(data[0].lat)];

    console.log("Latitude:", lat);
    console.log("Longitude:", lon);

    const newListing = new Listing(req.body.listing);
    newListing.geometry = { type: "Point", coordinates: [lon, lat] };

    const url = req.file?.path || "";
    const filename = req.file?.filename || "";
    newListing.image = { url, filename };

    newListing.owner = req.user._id;
    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  } catch (err) {
    console.error("Error in createListing:", err);
    next(err);
  }
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you are requested for does not exist!");
    return res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_20");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  };

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedList = await Listing.findByIdAndDelete(id);
  console.log(deletedList);
  req.flash("success", "Listing Deleted");
  res.redirect("/listings");
};