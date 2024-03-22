/**
 * Configures and starts an Express server with GraphQL API.
 * Connects to MongoDB database using Mongoose.
 * Configures GraphQL endpoint using express-graphql.
 * Enables CORS.
 * Listens on port 4000.
 */
 const express = require("express");
 const { graphqlHTTP } = require("express-graphql");
 const schema = require("./schema/schema");
 const Mongoose = require("mongoose");
 const uri =
   "mongodb+srv://tayloradam1999:papabless217489@cluster0.hptjf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
 const app = express();
 const cors = require("cors");
 app.use(cors());
 
 app.use((req, res, next) => {
   res.header("Access-Control-Allow-Origin", "*");
   next();
 });
 
 Mongoose.connect(uri);
 Mongoose.connection.once("open", () => {
   console.log("connected to database");
 });
 
 app.listen(4000, () => console.log(`now listening for request on port 4000`));
 
 app.use(
   "/graphql",
   graphqlHTTP({
     schema,
     graphiql: true,
   })
 );