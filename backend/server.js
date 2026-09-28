const express = require("express");
const cors = require("cors");

const app = express();

const typeDefs = require("./graphql/schema");
const getProducts = require("./graphql/resolvers");

const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@as-integrations/express5");

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers: getProducts
});

async function startServer() {
  await apolloServer.start();
  console.log("Apollo Server started");

  app.use(cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }));

  app.options("/graphql", cors());

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