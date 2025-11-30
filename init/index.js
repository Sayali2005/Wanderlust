const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

// Load environment variables
if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

const dbUrl = process.env.ATLAS_DB_URL;

main()
    .then(() => {
        console.log("Connection Successful!");
    })
    .catch((err) => { console.log(err) });

async function main() {
    await mongoose.connect(dbUrl);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj) => ({
        ...obj,
        owner: "6841b6b396cf3a6251f9ad27",
        geometry: { type: 'Point', coordinates: [77.209, 28.6139] }
    }));
    await Listing.insertMany(initdata.data);
    console.log("Data was initialize");
};

initDB();