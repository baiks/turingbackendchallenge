var express = require('express');
var db = require('../Models/DBConnection');
var jwt = require("../AccessTokens/JWT");
var router = express.Router();
const stripe = require("stripe")(db.config.Stripe.Secret_key);

/* /shipping/regions */
router.get('/shipping/regions', function (req, res) {
    response = {
        "code": "SPR_01",
        "message": "An error occurred.",
        "status": "500"
    }
    if (req.headers["user-key"] === undefined) {
        response = {
            "code": "SPR_04",
            "message": "Missing Authorization key.",
            "status": "500"
        }
        return res.status(400).send(response);
    }
    if (!jwt.verify(req.headers["user-key"])) {
        response = {
            "code": "SPR_03",
            "message": "Authorization failed.Token is invalid or has expired.",
            "status": "500"
        }
        return res.status(400).send(response);
    }
    //Find All
    db.ShippingRegion.findAll().then(function (shippingregion) {
        if (shippingregion.length < 1) {
            var response = {
                "code": "SPR_01",
                "message": "Shipping regions not set up.",
                "status": "500"
            }
            console.log("Response:: " + JSON.stringify(response));
            res.send(response);
        } else {
            console.log("Response:: " + JSON.stringify(shippingregion));
            res.status(200).send(shippingregion);
        }
    }).catch((err) => {
        res.status(400).send(err);
    });
});
/* /shipping/regions/{shipping_region_id} */
router.get('/shipping/regions/:shipping_region_id', function (req, res) {
    var response = {
        "code": "SPR_01",
        "message": "An error occurred.",
        "status": "500"
    }
    if (req.headers["user-key"] === undefined) {
        response = {
            "code": "SPR_04",
            "message": "Missing Authorization key.",
            "status": "500"
        }
        return res.status(400).send(response);
    }
    if (!jwt.verify(req.headers["user-key"])) {
        response = {
            "code": "SPR_03",
            "message": "Authorization failed.Token is invalid or has expired.",
            "status": "500"
        }
        return res.status(400).send(response);
    }
    //Find All
    db.Shipping.findAll({
        where: { shipping_region_id: req.params.shipping_region_id }
    }).then(function (shippingregion) {
        if (shippingregion.length < 1) {
            response = {
                "code": "SPR_01",
                "message": "Shipping with ID: " + req.params.shipping_region_id + " not not set up.",
                "status": "500"
            }
            console.log("Response:: " + JSON.stringify(response));
            res.status(400).send(response);
        } else {
            console.log("Response:: " + JSON.stringify(shippingregion));
            res.status(200).send(shippingregion);
        }
    }).catch((err) => {
        res.status(400).send(err);
    });
});
/* /stripe/charge */
router.post('/stripe/charge', function (req, res) {
    var response = {
        "code": "SPR_01",
        "message": "An error occurred.",
        "status": "500"
    }
    if (req.headers["user-key"] === undefined) {
        response = {
            "code": "SPR_04",
            "message": "Missing Authorization key.",
            "status": "500"
        }
        return res.status(400).send(response);
    }
    if (!jwt.verify(req.headers["user-key"])) {
        response = {
            "code": "SPR_03",
            "message": "Authorization failed.Token is invalid or has expired.",
            "status": "500"
        }
        return res.status(400).send(response);
    }

    //Find One
    db.Customer.findOne({
        where: {
            user_key: req.headers["user-key"].split(" ")[1],
        },
        include: [{
            model: db.Order,
            required: true,
            where: {
                order_id: req.query.order_id,
            }
        }]
    }).then(function (customer) {
        if (customer.length < 1) {
            var response = {
                "code": "SPR_01",
                "message": "Customer not set up regions not set up.",
                "status": "500"
            }
            console.log("Response:: " + JSON.stringify(response));
            res.status(400).send(response);
        } else {
            console.log("Response:: " + JSON.stringify(customer));
            // create a customer 
            stripe.customers.create({
                email: req.query.email,
                card: req.query.stripeToken
            }).then(function (customer) {
                stripe.charges.create({ // charge the customer
                    amount: customer.Order.total_amount,
                    description: "Being Payment for order: " + req.params.order_id,
                    currency: "USD",
                    customer: customer.customer_id
                }).then(function (striperesponse) {
                    res.status(200).send(striperesponse);
                }).catch((err) => {
                    res.status(400).send(err);
                });
                res.status(200).send(customer);
            }).catch((err) => {
                res.status(400).send(err);
            });
        }
    });
});
//export this router to use in our index.js
module.exports = router;