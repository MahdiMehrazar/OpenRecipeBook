try {
  var config = require("./config");
} catch (ex) {
  console.log(ex);
}

module.exports = {
  database: process.env.DATABASEURL || "mongodb://localhost/openrecipebook", //DATABASEURL environment variable was set in the heroku website with the mlab database as the value.
  secret: process.env.DBSECRET || config.dbsecret
};
