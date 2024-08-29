require('dotenv').config();

const express = require('express');
const models = require('./models');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const schema = require('./schema/schema');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection URI from the .env file
const MONGO_URI = process.env.REACT_APP_MONGO_URI;
if (!MONGO_URI) {
  throw new Error('You must provide a Mongo Atlas URI');
}

mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection
  .once('open', () => {
    console.log('Connected to Mongo Atlas instance.');
    console.log('REACT_APP_MONGO_URI:', process.env.REACT_APP_MONGO_URI);
    console.log('REACT_APP_FIREBASE_API_KEY:', process.env.REACT_APP_FIREBASE_API_KEY);
    console.log('REACT_APP_FIREBASE_AUTH_DOMAIN:', process.env.REACT_APP_FIREBASE_AUTH_DOMAIN);
    // Add similar lines for other environment variables
  })
  .on('error', (error) => console.log('Error connecting to Mongo Atlas:', error));

// GraphQL endpoint
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../build')));

// The "catchall" handler: for any request that doesn't match one above, send back index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;