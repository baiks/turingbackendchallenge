var express = require('express');
var db = require('../Models/DBConnection');
var router = express.Router();

/* /tax */
router.get('/tax', function (req, res) {
    response = {
        "code": "TAX_01",
        "message": "An error occurred.",
        "status": "500"
    }
    //Find All
    db.Tax.findAll().then(function (tax) {
        if (tax.length < 1) {
            var response = {
                "code": "TAX_01",
                "message": "Taxes not set up.",
                "status": "500"
            }
            console.log("Response:: " + JSON.stringify(response));
            res.send(response);
        } else {
            console.log("Response:: " + JSON.stringify(tax));
            res.status(200).send(tax);
        }
    }).catch((err) => {
        res.status(400).send(err);
    });
});
/* /tax/{tax_id} */
router.get('/tax/:tax_id', function (req, res) {
    var response = {
        "code": "TAX_01",
        "message": "An error occurred.",
        "status": "500"
    }
    //Find One
    db.Tax.findOne({ where: { tax_id: req.params.tax_id } }).then(function (tax) {
        if (tax === null) {
            response = {
                "code": "TAX_01",
                "message": "Tax with ID: " + req.params.tax_id + " not not set up.",
                "status": "500"
            }
            console.log("Response:: " + JSON.stringify(response));
            res.send(response);
        } else {
            console.log("Response:: " + JSON.stringify(tax));
            res.status(200).send(tax);
        }
    }).catch((err) => {
        res.status(400).send(err);
    });
});

//export this router to use in our index.js
module.exports = router;