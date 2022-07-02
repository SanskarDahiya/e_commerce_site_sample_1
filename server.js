// ==========  server.js ==============
// Requirements
const mongoose = require("mongoose");
const express = require("express");
const formidableMiddleware = require("express-formidable");
require("dotenv").config({ path: require("find-config")(".env") });
const { User, Posts } = require("./databaseSchema");
// const handle = app.getRequestHandler();
// server.all("*", (req, res) => {
//   return handle(req, res);
// });

// Running the server
const run = async () => {
  if (process.env.MONGO_URI && process.env.MONGO_DB) {
    await mongoose.connect(process.env.MONGO_URI + process.env.MONGO_DB, {
      useNewUrlParser: true,
    });

    const AdminBro = require("admin-bro");
    const AdminBroExpressjs = require("admin-bro-expressjs");
    // const next = require("next");
    const port = parseInt(process.env.PORT, 10) || 3001;
    // const dev = process.env.NODE_ENV !== "production";
    // const app = next({ dev });

    // We have to tell AdminBro that we will manage mongoose resources with it
    AdminBro.registerAdapter(require("admin-bro-mongoose"));

    // express server definition
    const server = express();
    server.use(formidableMiddleware());

    // Pass all configuration settings to AdminBro
    const adminBro = new AdminBro({
      resources: [User, Posts],
      rootPath: "/",
    });

    // Build and use a router which will handle all AdminBro routes
    const router = AdminBroExpressjs.buildRouter(adminBro);
    server.use(adminBro.options.rootPath, router);

    await server.listen(port, () =>
      console.log(`Example app listening on port ${port}!`)
    );
  } else {
    console.log(`Db Connection Failed`);
  }
};
// app.prepare().then(async () => {
run();
// });
