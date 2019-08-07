var express = require('express');
var db = require('../Models/DBConnection');
var router = express.Router();
var jwt = require("../AccessTokens/JWT");
var fb = require("../AccessTokens/Facebook");
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
/* /customer create a customer */
router.put('/customers', function (req, res) {
    var response = {
        "code": "CUST_01",
        "message": "An error occurred.",
        "status": "500"
    }
    if (req.headers["user-key"] === undefined) {
        response = {
            "code": "CUST_04",
            "message": "Missing Authorization key.",
            "status": "500"
        }
        return res.status(400).send(response);
    }
    if (!jwt.verify(req.headers["user-key"])) {
        response = {
            "code": "CUST_03",
            "message": "Authorization failed.Token is invalid or has expired.",
            "status": "500"
        }
        return res.status(400).send(response);
    }

    //Find One
    db.Customer.create(req.body).then(function (customer) {
        if (customer.length < 1) {
            var response = {
                "code": "CUST_02",
                "message": "Failed to create customer",
                "status": "500"
            }
            console.log("Response:: " + JSON.stringify(response));
            res.status(401).send(response);
        } else {
            console.log("Response:: " + JSON.stringify(customer));
            response = {};
            response.customer = customer;
            var cust = {};
            cust.customer = response;
            var token = jwt.sign(req.query);
            cust.accessToken = "Bearer " + token.accessToken;
            cust.expires_in = token.expiresIn;
            console.log("Access Token:: " + token.accessToken);
            /** Update user key Start **/
            db.Customer.update({
                user_key: token.accessToken
            }, {
                    where: {
                        email: req.query.email,
                    }
                });
            /** Update user key End **/
            res.status(200).send(cust);
        }

    }).catch((err) => {
        res.status(400).send(err);
    });
});
/* /customer Update a customer */
router.put('/customer', function (req, res) {
    var response = {
        "code": "CUST_01",
        "message": "An error occurred.",
        "status": "500"
    }
    if (req.headers["user-key"] === undefined) {
        response = {
            "code": "CUST_04",
            "message": "Missing Authorization key.",
            "status": "500"
        }
        return res.status(400).send(response);
    }
    if (!jwt.verify(req.headers["user-key"])) {
        response = {
            "code": "CUST_03",
            "message": "Authorization failed.Token is invalid or has expired.",
            "status": "500"
        }
        return res.status(400).send(response);
    }

    //Find One
    db.Customer.update({
        password: req.query.password,
        day_phone: req.query.day_phone,
        eve_phone: req.query.eve_phone,
        mob_phone: req.query.mob_phone,
        email: req.query.email
    }, {
            where: {
                user_key: req.headers["user-key"].split(" ")[1],
            }
        }).then(function (customer) {
            console.log("Response:: " + JSON.stringify(customer));
            res.status(200).send(customer);
        }).catch((err) => {
            res.status(400).send(err);
        });
});
/* /customer Get a customer by ID. The customer is getting by Token.*/
router.get('/customer', function (req, res) {
    console.log("Get customer");
    var response = {
        "code": "CUST_01",
        "message": "An error occurred.",
        "status": "500"
    }
    if (req.headers["user-key"] === undefined) {
        response = {
            "code": "CUST_04",
            "message": "Missing Authorization key.",
            "status": "500"
        }
        return res.status(400).send(response);
    }
    if (!jwt.verify(req.headers["user-key"])) {
        response = {
            "code": "CUST_03",
            "message": "Authorization failed.Token is invalid or has expired.",
            "status": "500"
        }
        return res.status(400).send(response);
    }
    //Find One
    db.Customer.findOne({
        where: {
            user_key: req.headers["user-key"].split(" ")[1],
        }
    }).then(function (customer) {
        if (customer === null) {
            response = {
                "code": "CUST_02",
                "message": "Customer not logged in",
                "status": "500"
            }
            console.log("Response:: " + JSON.stringify(response));
            res.status(401).send(response);
        } else {
            console.log("Response:: " + JSON.stringify(customer));
            res.status(200).send(customer);
        }

    }).catch((err) => {
        res.status(400).send(err);
    });
});

/* /customers/login Sign in in the Shopping.*/
router.post('/customers/login', function (req, res) {
    var response = {
        "code": "CUST_01",
        "message": "An error occurred.",
        "status": "500"
    }

    console.log(req.body);
    //Find One
    db.Customer.findOne({
        where: {
            email: req.body.email,
            password: req.body.password
        }
    }).then(function (customer) {
        if (customer.length < 1) {
            response = {
                "code": "CUST_02",
                "message": "Customer not set up.",
                "status": "500"
            }
            console.log("Response:: " + JSON.stringify(response));
            res.status(400).send(response);
        } else {
            response = {};
            response.schema = customer;
            var cust = {};
            cust.customer = response;
            var token = jwt.sign(req.query);
            cust.accessToken = "Bearer " + token.accessToken;
            cust.expires_in = token.expiresIn;
            console.log("Access Token:: " + token.accessToken);
            /** Update user key Start **/
            db.Customer.update({
                user_key: token.accessToken
            }, {
                    where: {
                        email: req.query.email,
                    }
                });
            /** Update user key End **/
            res.status(200).send(cust);
        }
    }).catch((err) => {
        res.status(400).send(err);
    });
})
/* /customers/facebook Sign in with a facebook login token.*/
router.post('/customers/facebook', function (req, res) {
    var user = fb.getUser(req.body.access_token);
    var response = {
        "code": "CUST_01",
        "message": "An error occurred.",
        "status": "500"
    }
    console.log("User:: " + JSON.stringify(user));
    if (user.length > 0) {
        // Find One
        db.Customer.findOne({
            where: {
                email: user.email,
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
                cust.accessToken = token.accessToken;
                cust.expires_in = token.expiresIn;
                console.log("schema:: " + JSON.stringify(cust));
                /** Update user key Start **/
                db.Customer.update({
                    user_key: token.accessToken
                }, {
                        where: {
                            email: user.email,
                        }
                    });
                /** Update user key End **/
                res.status(200).send(cust);
            }
        }).catch((err) => {
            res.status(400).send(err);
        });
    } else {
        response = {
            "code": "CUST_03",
            "message": "Access Token Authentication failed",
            "status": "401"
        }
        res.status(401).send(response);
    }
});
/* /customers/address Update the address from customer */
router.put('/customers/address', function (req, res) {
    var response = {
        "code": "CUST_01",
        "message": "An error occurred.",
        "status": "500"
    }
    if (req.headers["user-key"] === undefined) {
        response = {
            "code": "CUST_04",
            "message": "Missing Authorization key.",
            "status": "500"
        }
        return res.status(400).send(response);
    }
    if (!jwt.verify(req.headers["user-key"])) {
        response = {
            "code": "CUST_03",
            "message": "Authorization failed.Token is invalid or has expired.",
            "status": "500"
        }
        return res.status(400).send(response);
    }

    //Find One
    db.Customer.update({
        address_1: req.body.address_1,
        address_2: req.body.address_2,
        city: req.body.city,
        region: req.body.region,
        postal_code: req.body.postal_code,
        country: req.body.country,
        shipping_region_id: req.body.shipping_region_id,
    }, {
            where: {
                user_key: req.headers["user-key"].split(" ")[1],
            }
        }).then(function (customer) {
            //Find One
            db.Customer.findAll({
                where: {
                    user_key: req.headers["user-key"].split(" ")[1],
                }
            }).then(function (customer) {
                if (customer.length < 1) {
                    var response = {
                        "code": "CUST_02",
                        "message": "Customer not found",
                        "status": "500"
                    }
                    console.log("Response:: " + JSON.stringify(response));
                    res.status(401).send(response);
                } else {
                    console.log("Response:: " + JSON.stringify(customer));
                    res.status(200).send(customer);
                }
            });
        }).catch((err) => {
            res.status(400).send(err);
        });
});
/* /customers/creditCard Update the credit card from customer */
router.put('/customers/creditCard', function (req, res) {
    var response = {
        "code": "CUST_01",
        "message": "An error occurred.",
        "status": "500"
    }
    if (req.headers["user-key"] === undefined) {
        response = {
            "code": "DEPT_04",
            "message": "Missing Authorization key.",
            "status": "500"
        }
        return res.status(400).send(response);
    }
    if (!jwt.verify(req.headers["user-key"])) {
        response = {
            "code": "CUST_03",
            "message": "Authorization failed.Token is invalid or has expired.",
            "status": "500"
        }
        return res.status(400).send(response);
    }
    //Find One
    db.Customer.update({
        credit_card: req.query.credit_card,
    }, {
            where: {
                user_key: req.headers["user-key"].split(" ")[1],
            }
        }).then(function (customer) {
            //Find One
            db.Customer.findAll({
                where: {
                    user_key: req.headers["user-key"].split(" ")[1],
                }
            }).then(function (customer) {
                if (customer.length < 1) {
                    var response = {
                        "code": "CUST_02",
                        "message": "Customer not found",
                        "status": "500"
                    }
                    console.log("Response:: " + JSON.stringify(response));
                    res.status(401).send(response);
                } else {
                    console.log("Response:: " + JSON.stringify(customer));
                    res.status(200).send(customer);
                }
            });
        }).catch((err) => {
            res.status(400).send(err);
        });
});
//export this router to use in our index.js
module.exports = router;