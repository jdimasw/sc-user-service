const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose');
const tokenCheckMiddleware = require('./token-check-middleware');
const controller = require('./controller');
require('dotenv').config();

app.use(express.urlencoded({ extended: true }))
app.use(express.json());

app.get('/', (req, res) => {
  res.send('On home')
})

app.use(tokenCheckMiddleware);
app.use('/users', controller);

mongoose.connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log('connected to DB!')
);

app.listen(port, () => {
  console.log(`User Service listening at http://localhost:${port}`)
})
