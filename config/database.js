const { Sequelize } = require('sequelize');
const fs = require('fs');
require('dotenv').config();


const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    /* dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
            ca: fs.readFileSync('/home/ec2-user/diario-leitura/global-bundle.pem').toString(),
        }
    } */
});

module.exports = sequelize;