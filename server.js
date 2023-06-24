'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const musicRouter = require('./routes/music');
const loginRouter = require('./routes/login');

const app = express(); // app variable that can be used to configure our server

app.use(cors()); // Middleware to use cors for clients to access our page

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true
}).then(con => console.log(`Connected to database with ${con.connection.host}`));
// const db = mongoose.connection;
// db.on('error', (error) => console.error(error));
// db.once('open', () => console.log('Connected to database'));

app.use(express.json());

// Add Access Control Allow Origin headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://jrosecow.com');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.use('/music', musicRouter); // use this route whenever we query music. ex: http://localhost:3000/music - whenever this url is used

app.use('/protected', loginRouter);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log('Server has started on port ' + PORT));
