
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');


const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');


const { errorHandler } = require('./middleware/errorHandler');

const app = express();


app.use(cors());
app.use(bodyParser.json());


app.use('/api', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);


app.use((req, res, next) => {
    res.status(404).json({ message: 'Route Not Found' });
});


app.use(errorHandler);

module.exports = app;