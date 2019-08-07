var express = require('express');
var db = require('../Models/DBConnection');
var router = express.Router();
var jwt = require("../AccessTokens/JWT");
var FlakeIdGen = require('flake-idgen');
var intformat = require('biguint-format');
var generator = new FlakeIdGen();

/* /shoppingcart/generateUniqueId Generete the unique CART ID*/
router.get('/shoppingcart/generateUniqueId', function (req, res) {
    var response = {
        "code": "CART_01",
        "message": "An error occurred.",
        "status": "500"
    }
    if (req.headers["user-key"] === undefined) {
        response = {
            "code": "CART_04",
            "message": "Missing Authorization key.",
            "status": "500"
        }
        return res.status(400).send(response);
    }
    if (!jwt.verify(req.headers["user-key"])) {
        response = {
            "code": "CART_03",
            "message": "Authorization failed.Token is invalid or has expired.",
            "status": "500"
        }
        return res.status(400).send(response);
    }

    response = {};
    response.cart_id = intformat(generator.next(), 'dec')
    res.status(200).send(response);
});

/* /shoppingcart/add Add a Product in the cart */
router.post('/shoppingcart/add', function (req, res) {
    var response = {
        "code": "CART_01",
        "message": "An error occurred.",
        "status": "500"
    }
    if (req.headers["user-key"] === undefined) {
        response = {
            "code": "CART_04",
            "message": "Missing Authorization key.",
            "status": "500"
        }
        return res.status(400).send(response);
    }
    if (!jwt.verify(req.headers["user-key"])) {
        response = {
            "code": "CART_03",
            "message": "Authorization failed.Token is invalid or has expired.",
            "status": "500"
        }
        res.status(400).send(response);
    }

    db.ShoppingCart.create(req.query).then(function (shoppingcart) {
        if (shoppingcart.length < 1) {
            response = {
                "code": "CART_02",
                "message": "Adding product to cart failed.",
                "status": "500"
            }
            console.log("Response:: " + JSON.stringify(response));
            res.status(400).send(response);
        } else {
            console.log("Response:: " + JSON.stringify(shoppingcart));
            res.status(200).send(shoppingcart);
        }
    }).catch((err) => {
        res.status(400).send(err);
    });
});
/* /shoppingcart/{cart_id} Get List of Products in Shopping Cart*/
router.get('/shoppingcart/:cart_id', function (req, res) {
    var response = {
        "code": "CART_01",
        "message": "An error occurred.",
        "status": "500"
    }
    if (req.headers["user-key"] === undefined) {
        response = {
            "code": "CART_04",
            "message": "Missing Authorization key.",
            "status": "500"
        }
        return res.status(400).send(response);
    }
    if (!jwt.verify(req.headers["user-key"])) {
        response = {
            "code": "CART_03",
            "message": "Authorization failed.Token is invalid or has expired.",
            "status": "500"
        }
        res.status(400).send(response);
    }
    db.ShoppingCart.findAll({
        include: [{
            model: db.Product,
            required: true
        }],
        attributes: ["item_id", "cart_id", "attributes", "quantity"],
        where: {
            cart_id: req.params.cart_id
        }
    }).then(function (shoppingcart) {
        if (shoppingcart.length < 1) {
            response = {
                "code": "CART_02",
                "message": "Cart ID: " + req.params.cart_id + " not found.",
                "status": "500"
            }
            console.log("Response:: " + JSON.stringify(response));
            res.status(400).send(response);
        } else {
            var finalresponse = [];
            for (key in shoppingcart) {
                console.log("Shopping cart:: " + JSON.stringify(shoppingcart[key]));
                response = {
                    "item_id": shoppingcart[key].item_id,
                    "cart_id": shoppingcart[key].cart_id,
                    "attributes": shoppingcart[key].attributes,
                    "quantity": shoppingcart[key].quantity
                };
                //JSON.parse(JSON.stringify(shoppingcart[key]));
                var resp = {};
                resp = {
                    "name": shoppingcart[key].product.name,
                    "product_id": shoppingcart[key].product.product_id,
                    "image": shoppingcart[key].product.image,
                    "price": shoppingcart[key].product.price,
                    "discounted_price": shoppingcart[key].product.discounted_price,
                };
                response = Object.assign(resp, response);
                finalresponse.push(response);
            }
            res.status(200).send(finalresponse);
        }
    }).catch((err) => {
        res.status(400).send(err);
    });
});
/* /shoppingcart/update/{item_id} */
router.put('/shoppingcart/update/:item_id', function (req, res) {
    var response = {
        "code": "CART_01",
        "message": "An error occurred.",
        "status": "500"
    }
    if (req.headers["user-key"] === undefined) {
        response = {
            "code": "CART_04",
            "message": "Missing Authorization key.",
            "status": "500"
        }
        return res.status(400).send(response);
    }
    if (!jwt.verify(req.headers["user-key"])) {
        response = {
            "code": "CART_03",
            "message": "Authorization failed.Token is invalid or has expired.",
            "status": "500"
        }
        res.status(400).send(response);
    }

    db.ShoppingCart.update({ quantity: req.query.quantity },
        { where: { item_id: req.params.item_id } }
    ).then(function (shoppingcart) {
        if (shoppingcart.length < 1) {
            response = {
                "code": "CART_02",
                "message": "Updating cart quantity failed.",
                "status": "500"
            }
            console.log("Response:: " + JSON.stringify(response));
            res.status(400).send(response);
        } else {
            db.ShoppingCart.findAll({
                where: {
                    item_id: req.params.item_id
                }
            }).then(function (shoppingcart) {

                console.log("Response:: " + JSON.stringify(shoppingcart));
                res.status(200).send(shoppingcart[0]);
            });
        }
    }).catch((err) => {
        res.status(400).send(err);
    });
});
/* /shoppingcart/empty/{cart_id} */
router.delete('/shoppingcart/empty/:cart_id', function (req, res) {
    var response = {
        "code": "CART_01",
        "message": "An error occurred.",
        "status": "500"
    }
    if (req.headers["user-key"] === undefined) {
        response = {
            "code": "CART_04",
            "message": "Missing Authorization key.",
            "status": "500"
        }
        return res.status(400).send(response);
    }
    if (!jwt.verify(req.headers["user-key"])) {
        response = {
            "code": "CART_03",
            "message": "Authorization failed.Token is invalid or has expired.",
            "status": "500"
        }
        res.status(400).send(response);
    }

    db.ShoppingCart.destroy({
        where: {
            cart_id: req.params.cart_id
        }
    }).then(function (shoppingcart) {
        if (shoppingcart.length < 1) {
            response = {
                "code": "CART_02",
                "message": "Deleting product from cart failed.",
                "status": "500"
            }
            console.log("Response:: " + JSON.stringify(response));
            res.status(400).send(response);
        } else {
            db.ShoppingCart.findAll({
                where: {
                    cart_id: req.params.cart_id
                }
            }).then(function (shoppingcart) {
                console.log("Response:: " + JSON.stringify(shoppingcart));
                res.status(200).send(shoppingcart);
            });
        }
    }).catch((err) => {
        res.status(400).send(err);
    });
});
/* /shoppingcart/removeProduct/{item_id} */
router.delete('/shoppingcart/removeProduct/:item_id', function (req, res) {
    var response = {
        "code": "CART_01",
        "message": "An error occurred.",
        "status": "500"
    }
    if (req.headers["user-key"] === undefined) {
        response = {
            "code": "CART_04",
            "message": "Missing Authorization key.",
            "status": "500"
        }
        return res.status(400).send(response);
    }
    if (!jwt.verify(req.headers["user-key"])) {
        response = {
            "code": "CART_03",
            "message": "Authorization failed.Token is invalid or has expired.",
            "status": "500"
        }
        res.status(400).send(response);
    }

    db.ShoppingCart.destroy({
        where: {
            cart_id: req.params.cart_id
        }
    }).then(function (shoppingcart) {
        if (shoppingcart.length < 1) {
            response = {
                "code": "CART_02",
                "message": "Deleting product from cart failed.",
                "status": "500"
            }
            console.log("Response:: " + JSON.stringify(response));
            res.status(400).send(response);
        } else {
            response = { "message": "Product removed from cart successfully" };
            console.log("Response:: " + JSON.stringify(shoppingcart));
            res.status(200).send(shoppingcart);
        }
    }).catch((err) => {
        res.status(400).send(err);
    });
});
//export this router to use in our index.js
module.exports = router;