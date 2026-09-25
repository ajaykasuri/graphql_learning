const express = require("express");

const app = express();

const typeDefs = require("./graphql/schema");
const getProducts = require("./graphql/resolvers");

const { ApolloServer } = require("@apollo/server");//Apollo Server is responsible for running GraphQL.

//This is the bridge between Express and Apollo.
//Without this, Express doesn't know that /graphql should be handled by Apollo.
const { expressMiddleware } = require("@as-integrations/express5");

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers: getProducts
});

async function startServer() {
  await apolloServer.start();
console.log("Apollo Server started");
//Whenever a request comes to /graphql, let Apollo handle it.
  app.use(
    "/graphql",
    express.json(),
    expressMiddleware(apolloServer)
  );

  app.listen(4456, () => {
    console.log("Server running on port 4456");
  });
}

startServer();