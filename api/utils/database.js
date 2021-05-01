const Sequelize = require("sequelize");
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    dialect: process.env.DB_DIALECT,
    host: process.env.DB_HOST
});

sequelize
    .authenticate()
    .catch(function (err) {
        console.log('Unable to connect to the database:', err);
    });

module.exports = {Sequelize, sequelize}