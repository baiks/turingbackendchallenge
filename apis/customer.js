var express = require('express');
var db = require('../Models/DBConnection');
var router = express.Router();
var jwt = require("../AccessTokens/JWT");
var fb = require("../AccessTokens/Facebook");

/* /customer Update a customer */
router.put('/customer', function (req, res) {
    //Find One
    db.Customer.update({
        password: req.query.password,
        day_phone: req.query.day_phone,
        eve_phone: req.query.eve_phone,
        mob_phone: req.query.mob_phone,
    }, {
            where: {
                email: req.query.email,
            }
        }).then(function (customer) {

            //Find One
            db.Customer.findAll({
                where: {
                    email: req.query.email,
                }
            }).then(function (customer) {
                if (customer.length < 1) {
                    var response = {
                        "code": "CUST_02",
                        "message": "Customer not found",
                        "status": "500"
                    }
                    console.log("Response:: " + JSON.stringify(response));
                    res.send(response);
                } else {
                    console.log("Response:: " + JSON.stringify(customer));
                    res.send(customer);
                }

            });
        });
});
/* /customers/login Sign in in the Shopping.*/
router.post('/customers/login', function (req, res) {
    var response = {
        "code": "CUST_01",
        "message": "An error occurred.",
        "status": "500"
    }
    console.log(req.query);
    //Find One
    db.Customer.findOne({
        where: {
            email: req.query.email,
            password: req.query.password
        }
    }).then(function (customer) {
        if (customer.length < 1) {
            response = {
                "code": "CUST_02",
                "message": "Customer not set up.",
                "status": "500"
            }
            console.log("Response:: " + JSON.stringify(response));
            res.send(response);
        } else {
            response = {};
            response.schema = customer;
            var cust = {};
            cust.customer = response;
            var token = jwt.sign(req.query);
            cust.accessToken = "Bearer " + token.accessToken;
            cust.expires_in = token.expiresIn;
            console.log("schema:: " + JSON.stringify(cust));
            res.send(cust);
        }
    });
})
/* /customers/facebook Sign in with a facebook login token.*/
router.post('/customers/facebook', function (req, res) {
    var response = {
        "code": "CUST_01",
        "message": "An error occurred.",
        "status": "500"
    }
    console.log("Access Token:: " + req);
    res.send(req.user ? 200 : 401);
    //Find One
    // db.Customer.findOne({
    //     where: {
    //         email: req.query.email,
    //         password: req.query.password
    //     }
    // }).then(function (customer) {
    //     if (customer.length < 1) {
    //         response = {
    //             "code": "CUST_02",
    //             "message": "Customer not set up.",
    //             "status": "500"
    //         }
    //         console.log("Response:: " + JSON.stringify(response));
    //         res.send(response);
    //     } else {
    //         response = {};
    //         response.schema = customer;
    //         var cust = {};
    //         cust.customer = response;
    //         var token = jwt.sign(req.query);
    //         cust.accessToken = token.accessToken;
    //         cust.expires_in = token.expiresIn;
    //         console.log("schema:: " + JSON.stringify(cust));
    //         res.send(cust);
    //     }
    // });
})
//export this router to use in our index.js
module.exports = router;