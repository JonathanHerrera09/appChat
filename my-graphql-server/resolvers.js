// resolvers.js
const resolvers = {
    Query: {
      hello: () => 'Hello, world!',
      allExamples: () => [
        { id: 1, name: 'Example 1', description: 'This is an example' },
        { id: 2, name: 'Example 2', description: 'This is another example' },
        { id: 2, name: 'Example 3', description: 'This is another example3' },
      ],
    },
  };
  
  module.exports = resolvers;
  