const { Sequelize } = require('sequelize');
require('dotenv').config(); 

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false 
        }
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false, 
    pool: {
        max: 10,
        min: 2,
        acquire: 30000,
        idle: 10000
    }
});

module.exports = sequelize;