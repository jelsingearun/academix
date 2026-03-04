const mongoose = require('mongoose');

const connectionString = process.env.MONGODB_URI;  // Use environment variable for MongoDB credentials

mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.error('MongoDB connection error:', err));
