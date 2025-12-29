const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes');
const stateRoutes = require('./routes/stateRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/states', stateRoutes);

mongoose.connect(process.env.MONGO_URI, {})
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error(err));

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});

