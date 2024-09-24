const mongoose = require('mongoose');


const connectDB = async () => {
    await mongoose.connect("mongodb+srv://elCamino:ROwsFTthKIVptbe3@elcamino.bwjha.mongodb.net/devTalks")
}

module.exports = connectDB;
