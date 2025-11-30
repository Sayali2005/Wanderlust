const mongoose = require("mongoose");
const Listing = require("./models/listing.js");

async function main() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/new_Wanderlust");
        console.log("Connected to DB");

        // 1. Fetch one listing and print it raw
        const oneListing = await Listing.findOne({}).lean();
        console.log("--- Sample Listing (Raw) ---");
        console.log(JSON.stringify(oneListing, null, 2));

        // 2. Check if category exists
        if (oneListing.category) {
            console.log(`Category field exists: '${oneListing.category}'`);
            console.log(`Type of category: ${typeof oneListing.category}`);
            console.log(`Length of category: ${oneListing.category.length}`);

            // 3. Try to find it specifically
            const match = await Listing.find({ category: oneListing.category });
            console.log(`Query for '${oneListing.category}' returned ${match.length} results.`);

            // 4. Try to find 'Trending' specifically
            const trending = await Listing.find({ category: "Trending" });
            console.log(`Query for 'Trending' returned ${trending.length} results.`);
        } else {
            console.log("CRITICAL: 'category' field is MISSING from the document!");
        }

    } catch (err) {
        console.error(err);
    } finally {
        mongoose.connection.close();
    }
}

main();
