const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/users');

const app = express();

mongoose.connect(`mongodb+srv://mean-stack-user:${process.env.MONGO_ATLAS_PW}@mean-stack-cluster.rb5us.mongodb.net/node-angular?retryWrites=true&w=majority`)
  .then(() => {
    console.log("Connected to database!")
  })
  .catch((error) => {
    console.log("Connection failed! Error: ", error);
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/images', express.static(path.join('images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  );
  next();
});

app.get('/', (req, res, next) => {
  res.send("Hello World!");
});

app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

module.exports = app;
