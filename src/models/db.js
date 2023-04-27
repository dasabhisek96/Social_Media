const mongoose = require('mongoose');

module.exports = async () => {
    try {
        console.log(process.env.MONGOURL);
        await mongoose.connect('mongodb+srv://abhisekdas96:NMC708kORoY0sIiy@cluster0.dqo40zu.mongodb.net/?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Database connection succesfully')
    } catch (error) {
        console.error('Database connection error- ',error.message);
        throw error;
    }
}