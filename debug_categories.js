const mongoose = require("mongoose");
const Listing = require("./models/listing.js");

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/new_Wanderlust");
    console.log("Connected to DB");

    const listings = await Listing.find({});
    console.log(`Total listings: ${listings.length}`);

    const categories = {};
    listings.forEach(l => {
        if (categories[l.category]) {
            categories[l.category]++;
        } else {
            categories[l.category] = 1;
        }
    });

    console.log("Categories found in DB:", categories);

    // Check for one specific example
    const mountainListings = await Listing.find({ category: "Mountains" });
    console.log(`Listings with category 'Mountains': ${mountainListings.length}`);

    mongoose.connection.close();
}

main().catch(err => console.log(err));
