const mongoose = require("mongoose");

module.exports.connect = () =>{
    try {
        mongoose.connect(process.env.MONGOOSE_URL);
        console.log("Successfully");
    } catch (error) {
        console.log("Error!")
    }
} 