// schema.js
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Query {
    hello: String
    allExamples: [Example]
  }

  type Example {
    id: ID!
    name: String!
    description: String
  }
`;

module.exports = typeDefs;
