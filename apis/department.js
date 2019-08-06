var express = require('express');
var db = require('../Models/DBConnection');
var router = express.Router();

/* /departments Get Departments */
router.get('/departments', function (req, res) {
  var response = {
    "code": "DEPT_01",
    "message": "An error occurred.",
    "status": "500"
  }
  
  //Find All
  db.Department.findAll().then(function (department) {
    if (department.length < 1) {
      var response = {
        "code": "DEP_02",
        "message": "Departments are not set up.",
        "status": "500"
      }
      console.log("Response:: " + JSON.stringify(response));
      res.status(400).send(response);
    } else {
      console.log("Response:: " + JSON.stringify(department));
      res.status(200).send(department);
    }
  });
})

/* /departments/{department_id} Get Department by ID */
router.get('/departments/:department_id', function (req, res) {
  var response = {
    "code": "DEPT_01",
    "message": "An error occurred.",
    "status": "500"
  }
 
  //Find One
  db.Department.findOne({
    where: {
      department_id: req.params.department_id
    }
  }).then(function (department) {
    if (department === null) {
      var response = {
        "code": "DEP_02",
        "message": "Department with ID: " + req.params.department_id + " does not exist",
        "status": "500"
      }
      console.log("Response:: " + JSON.stringify(response));
      res.status(400).send(response);
    } else {
      console.log("Response:: " + JSON.stringify(department));
      res.status(200).send(department);
    }

  });
});

//export this router to use in our index.js
module.exports = router;