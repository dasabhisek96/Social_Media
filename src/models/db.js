const mongoose = require('mongoose');

module.exports = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/socialmedia', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Database connection succesfully')
    } catch (error) {
        console.error('Database connection error- ',error.message);
        throw error;
    }
}