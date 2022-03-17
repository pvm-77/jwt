const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGO_URI;
exports.connect = () => {
    mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true
    }).then(
        () => {
            console.log('Database connection successful');
        }
    ).catch(
        err => {
            console.error('Database connection error');
            console.error(err);
            process.exit(1);
        }
    );
}

