const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const {descriptors, places } = require('./seedNamer');

mongoose.connect('mongodb://localhost:27017/camp', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("Connection Open!!!");
    })
    .catch(err => {
        console.log("Oh No error!!");
        console.log(err);
    })


const sample = array => array[Math.floor(Math.random()*array.length)]

const seedDb = async () => {
    await Campground.deleteMany({});
    for (let i=0; i<50; i++)
    {
        const rand = Math.floor(Math.random()*1000);
        const camp = new Campground({
            location : `${cities[rand].city}, ${cities[rand].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        })
        await camp.save();
    }

}

seedDb().then(() => {
    mongoose.connection.close();

});