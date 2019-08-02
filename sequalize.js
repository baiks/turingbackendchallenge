var Sequelize = require('sequelize');
var sequelize = new Sequelize('nodetest', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306,
  dialectOptions: {connectTimeout: 1000}, // mariadb connector option

  pool: {
    max: 5,
    min: 0,
    idle: 10000,
    acquire: 30000,
  },

  // SQLite only
  //'mysql'|'mariadb'|'sqlite'|'postgres'|'mssql'
  //storage: 'path/to/database.sqlite'
});

// Or you can simply use a connection uri
//var sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname');




//Insert
// User.create({
//     firstName: 'John',
//     lastName: 'Hancock'
// });

//Select
// User.findOne().then(function (user) {
//     console.log(user.get('firstName'));
// });


//Create model
var Project = sequelize.define('project', {
  title: Sequelize.STRING,
  description: Sequelize.TEXT
})

//Create table if doesn't exist
Project.sync({ force: false }).then(function () {
});

//Insert 
Project.create({
  title: 'Paul',
  description: 'This and that'
});

//Find One
// Project.findOne().then(function (project) {
//      console.log(project.get('description'));
// });

//Find All
Project.findAll().then(function (project) {
  console.log(JSON.stringify(project));
  for (var i = 0; i < project.length; i++) {
    console.log(project[i].title);
  }

  //Update
  Project.update({ title: "This ggg" }, {
    where: {
      title: "This"
    }
  }).then(() => {
    console.log("Done");
  });

// Delete
Project.destroy({
  where: {
    title: "Paul"
  }
}).then(() => {
  console.log("Done");
});


});