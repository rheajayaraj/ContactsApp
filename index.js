require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userroutes = require('./routes/users/route.js');
const contactroutes = require('./routes/contacts/route.js');
const mongoString = process.env.DATABASE_URL;
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
  console.log(error);
});

database.once('connected', () => {
  console.log('Database Connected');
});

const app = express();
app.use(bodyParser.json({ limit: '50mb' }));

app.listen(3000, () => {
  console.log(`Server Started at ${3000}`);
});

app.use('/api', userroutes);
app.use('/api', contactroutes);
