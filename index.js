const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql')
const { buildSchema } = require('graphql')

const app = express()

// Midlewares
app.use(bodyParser.json())

app.use('/api' , graphqlHttp({
  schema: buildSchema(`
    type RootQuery {
      events: [String!]!
    }

    type RootMutation {
      createEvent(name: String): String
    }

    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `)
  rootValue: {}
}))


const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log('App listening on port 5000...'));