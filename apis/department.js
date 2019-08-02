var express = require('express');
var db = require('../Models/DBConnection');
var router = express.Router();

/* /departments Get Departments */
router.get('/departments', function (req, res) {
    //Find All
    db.Department.findAll().then(function (department) {
      if (department.length < 1) {
        var response = {
          "code": "DEP_02",
          "message": "Departments not set up.",
          "status": "500"
        }
        console.log("Response:: " + JSON.stringify(response));
        res.send(response);
      } else {
        console.log("Response:: " + JSON.stringify(department));
        res.send(department);
      }
    });
  })
  
  /* /departments/{department_id} Get Department by ID */
  router.get('/departments/:department_id', function (req, res) {
    console.log('department id: ' + req.params.department_id);
    //Find One
    db.Department.findOne({
      where: {
        department_id: req.params.department_id
      }
    }).then(function (department) {
      if (department === null) {
        var response = {
          "code": "DEP_02",
          "message": "Don't exist department with this ID: " + req.params.department_id,
          "status": "500"
        }
        console.log("Response:: " + JSON.stringify(response));
        res.send(response);
      } else {
        console.log("Response:: " + JSON.stringify(department));
        res.send(department);
      }
  
    });
  });

//export this router to use in our index.js
module.exports = router;