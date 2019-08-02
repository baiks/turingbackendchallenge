var Sequelize = require('sequelize');
const Config = require('./../config')
const config = new Config();
var initconfig = JSON.parse(config.config());


console.log(initconfig.Database.username);

var sequelize = new Sequelize(initconfig.Database.dbname, initconfig.Database.username, initconfig.Database.password, {
    host: initconfig.Database.host,
    dialect: initconfig.Database.dialect,
    port: initconfig.Database.port,
    dialectOptions: { connectTimeout: 1000 }, // mariadb connector option

    pool: {
        max: 5,
        min: 0,
        idle: 10000,
        acquire: 30000,
    },
    //'mysql'|'mariadb'|'sqlite'|'postgres'|'mssql'
    // SQLite only
    //storage: 'path/to/database.sqlite'
});

//Create model
var User = sequelize.define('user', {
    firstname: {
        type: Sequelize.STRING,
    },
    lastname: {
        type: Sequelize.STRING
    },
    username: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    }
}, {
        freezeTableName: true // Model tableName will be the same as the model name
    });

//Create table
User.sync({ force: false }).then(function () { });