const mongoose = require('mongoose');

module.exports = async () => {
    try {
        await mongoose.connect(process.env.MONGOURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Database connection succesfully')
    } catch (error) {
        console.error('Database connection error- ',error.message);
        throw error;
    }
}