const mongoose = require('mongoose');

require("dotenv").config()



let connection = mongoose.connect(process.env.mongourl)


module.exports = connection