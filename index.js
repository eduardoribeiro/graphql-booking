const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');
const cors = require('cors');

const graphqlSchema = require('./graphql/schema/index');
const graphqlResolver = require('./graphql/resolvers/index');
const isAuth = require('./middlewares/is-auth.js');

const app = express();

const env = process.env.NODE_ENV || 'dev';

// Midlewares
app.use(bodyParser.json());
app.use(cors());
app.use(isAuth);

app.use(
  '/api',
  graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: env === 'dev'
  })
);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${
      process.env.MONGO_PASSWORD
    }@cluster0-4zajv.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`,
    { useNewUrlParser: true }
  )
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App running in port ${PORT}...`);
      if (env === 'dev') console.log('App is in development mode...');
    });
  })
  .catch(err => {
    console.error('Unable to connect to MongoDB', err);
  });
