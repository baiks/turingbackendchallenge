var express = require('express');
var db = require('../Models/DBConnection');
var router = express.Router();
var jwt = require("../AccessTokens/JWT");

/* /orders create order */
router.post('/orders', function (req, res) {
    var response = {
        "code": "ORD_01",
        "message": "An error occurred.",
        "status": "500"
    }
    if (req.headers["user-key"] === undefined) {
        response = {
            "code": "ORD_04",
            "message": "Missing Authorization key.",
            "status": "500"
        }
        return res.status(400).send(response);
    }
    if (!jwt.verify(req.headers["user-key"])) {
        response = {
            "code": "ORD_03",
            "message": "Authorization failed.Token is invalid or has expired.",
            "status": "500"
        }
        return res.status(400).send(response);
    }
    db.Customer.findOne({
        where: {
            user_key: req.headers["user-key"].split(" ")[1],
        }
    }).then(function (customer) {
        if (customer === null) {
            response = {
                "code": "ORD_02",
                "message": "Customer not found.",
                "status": "500"
            }
            res.status(400).send(response);
        } else {
            req.query.customer_id = customer.customer_id;
            db.Order.create(req.query).then(function (order) {
                if (order.length < 1) {
                    response = {
                        "code": "ORD_02",
                        "message": "Order for the customer not found.",
                        "status": "500"
                    }
                    console.log("Response:: " + JSON.stringify(response));
                    res.status(400).send(response);
                } else {
                    console.log("Response:: " + JSON.stringify(order));
                    res.status(200).send(order);
                }
            });
        }
    }).catch((err) => {
        res.status(400).send(err);
    });
});

/* /orders/{order_id} Get Order by ID */
router.get('/orders/:order_id', function (req, res) {
    var response = {
        "code": "ORD_01",
        "message": "An error occurred.",
        "status": "500"
    }
    if (req.headers["user-key"] === undefined) {
        response = {
            "code": "ORD_04",
            "message": "Missing Authorization key.",
            "status": "500"
        }
        return res.status(400).send(response);
    }
    if (!jwt.verify(req.headers["user-key"])) {
        response = {
            "code": "ORD_03",
            "message": "Authorization failed.Token is invalid or has expired.",
            "status": "500"
        }
        res.status(400).send(response);
    }
    switch (req.params.order_id) {
        case "inCustomer":
            db.Customer.findAll({
                include: [{
                    model: db.Order,
                    required: true
                }],
                where: {
                    user_key: req.headers["user-key"].split(" ")[1]
                }
            }).then(function (order) {
                if (order.length < 1) {
                    response = {
                        "code": "ORD_02",
                        "message": "Orders for the customer not found",
                        "status": "500"
                    }
                    console.log("Response:: " + JSON.stringify(response));
                    res.status(400).send(response);
                } else {
                    var finalresponse = [];
                    for (key in order[0].Orders) {
                        response = JSON.parse(JSON.stringify(order[0].Orders[key]));
                        var resp = {};
                        resp = order[0].Orders[key];
                        resp = { "name": order[0].name };
                        response = Object.assign(resp, response);
                        finalresponse.push(response);
                    }
                    res.status(200).send(finalresponse);
                }

            }).catch((err) => {
                res.status(400).send(err);
            });
            break;
        default:
            //Find One
            db.Order.findOne({
                where: {
                    order_id: req.params.order_id
                },
                include: [{
                    model: db.OrderDetail, as: 'order_items',
                    required: true
                }],
                attributes: ['order_id', ['total_amount', 'subtotal']]
            }).then(function (order) {
                if (order === null) {
                    var response = {
                        "code": "ORD_02",
                        "message": "Order with ID: " + req.params.order_id + " does not exist",
                        "status": "500"
                    }
                    console.log("Response:: " + JSON.stringify(response));
                    res.send(response);
                } else {
                    console.log("Response:: " + JSON.stringify(order));
                    res.status(200).send(order);
                }

            }).catch((err) => {
                res.status(400).send(err);
            });
            break;
    }
});
/* /orders/shortDetail/{order_id} */
router.get('/orders/shortDetail/:order_id', function (req, res) {
    var response = {
        "code": "ORD_01",
        "message": "An error occurred.",
        "status": "500"
    }
    if (req.headers["user-key"] === undefined) {
        response = {
            "code": "ORD_04",
            "message": "Missing Authorization key.",
            "status": "500"
        }
        return res.status(400).send(response);
    }
    if (!jwt.verify(req.headers["user-key"])) {
        response = {
            "code": "ORD_03",
            "message": "Authorization failed.Token is invalid or has expired.",
            "status": "500"
        }
        res.status(400).send(response);
    }
    db.Customer.findOne({
        include: [{
            model: db.Order,
            required: true,
            where: { order_id: req.params.order_id },
            attributes: ["order_id", "order_id", "created_on", "shipped_on", "status"]
        }],
        where: {
            user_key: req.headers["user-key"].split(" ")[1]
        }
    }).then(function (order) {
        if (order === null) {
            response = {
                "code": "ORD_02",
                "message": "Orders ID:" + req.params.order_id + " the customer not found",
                "status": "500"
            }
            console.log("Response:: " + JSON.stringify(response));
            res.status(400).send(response);
        } else {
            response = JSON.parse(JSON.stringify(order.Orders[0]));
            console.log("Orders:: " + JSON.stringify(order.Orders[0]));
            var resp = {};
            resp = order.Orders[0];
            resp = { "name": order.name };
            response = Object.assign(resp, response);
            res.status(200).send(response);
        }

    }).catch((err) => {
        res.status(400).send(err);
    });

});

//export this router to use in our index.js
module.exports = router;