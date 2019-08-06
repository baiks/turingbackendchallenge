var express = require('express');
var db = require('../Models/DBConnection');
var router = express.Router();
var jwt = require("../AccessTokens/JWT");
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json())
/* /products Get All Products*/
router.get('/products', function (req, res) {
    var response = {
        "code": "PRD_01",
        "message": "An error occurred.",
        "status": "500"
    }
    if (req.query.limit === undefined) {
        req.query.limit = 20;
    } if (req.query.page === undefined) {
        req.query.page = 1;
    }
    if (req.query.description_length === undefined) {
        req.query.description_length = 200;
    }

    //Find All
    db.Product.findAll({
        offset: parseInt(req.query.page), limit: parseInt(req.query.limit),
        attributes: ['name', 'product_id', 'price', 'discounted_price', 'thumbnail',
            [db.sequelize.fn('LEFT', db.sequelize.col('description'), req.query.description_length), 'description']],
    }).then(function (product) {
        if (product.length < 1) {
            response = {
                "code": "PRD_02",
                "message": "Product not set up.",
                "status": "500"
            }
            console.log("Response:: " + JSON.stringify(response));
            res.send(response);
        } else {
            response = {
                "count": parseInt(req.query.limit),
                "rows": product
            }
            res.status(200).send(response);
        }
    });
})

/* //products/search Search products*/
router.get('/products/search', function (req, res) {
    var response = {
        "code": "PRD_01",
        "message": "An error occurred.",
        "status": "500"
    }

    if (req.query.limit === undefined) {
        req.query.limit = 20;
    }
    if (req.query.page === undefined) {
        req.query.page = 1;
    }
    if (req.query.description_length === undefined) {
        req.query.description_length = 200;
    }
    if (req.query.all_words === undefined) {
        req.query.all_words = 'on';
    }
    if (req.query.query_string === undefined) {
        req.query.query_string = {};
    } else {
        var searchcol = JSON.parse(req.query.query_string);
    }
    //Find All
    db.Product.findAll({
        offset: parseInt(req.query.page), limit: parseInt(req.query.limit),
        attributes: ['name', 'product_id', 'price', 'discounted_price', 'thumbnail',
            [db.sequelize.fn('LEFT', db.sequelize.col('description'), req.query.description_length), 'description']],
        where: searchcol
    }).then(function (product) {
        if (product.length < 1) {
            response = {
                "code": "PRD_02",
                "message": "Product not set up.",
                "status": "500"
            }
            console.log("Response:: " + JSON.stringify(response));
            res.send(response);
        } else {
            response = {
                "count": parseInt(req.query.limit),
                "rows": product
            }
            res.status(200).send(response);
        }
    });
})
/* /products/{product_id} Product by ID*/
router.get('/products/:product_id', function (req, res) {
    console.log('product_id: ' + req.params.product_id);
    var response = {
        "code": "PRD_01",
        "message": "An error occurred.",
        "status": "500"
    }
    //Find One
    db.Product.findOne({
        where: { product_id: req.params.product_id }
    }).then(function (product) {
        if (product.length < 1) {
            response = {
                "code": "PRD_02",
                "message": "Product not set up.",
                "status": "500"
            }
            console.log("Response:: " + JSON.stringify(response));
            res.status(400).send(response);
        } else {
            res.status(200).send(product);
        }
    });
})

/* /products/inCategory/{category_id} Get a lit of Products of Categories */
router.get('/products/inCategory/:category_id', function (req, res) {
    console.log('category_id: ' + req.params.category_id);
    var response = {
        "code": "PROD_01",
        "message": "An error occurred",
        "status": "500"
    }

    if (req.query.limit === undefined) {
        req.query.limit = 20;
    }
    if (req.query.page === undefined) {
        req.query.page = 1;
    }
    if (req.query.description_length === undefined) {
        req.query.description_length = 200;
    }
    //Find All
    db.ProductCategory.findAll({
        offset: parseInt(req.query.page), limit: parseInt(req.query.limit),
        where: {
            category_id: req.params.category_id
        },
        include: [{
            model: db.Product, as: 'product',
            required: true,
            attributes: ['name', 'product_id', 'price', 'discounted_price', 'thumbnail',
                [db.sequelize.fn('LEFT', db.sequelize.col('description'), req.query.description_length), 'description']],
        }]
    }).then(function (product) {
        if (product.length < 1) {
            response = {
                "code": "PROD_01",
                "message": "Don't exist product with this ID: " + req.params.product_id,
                "status": "500"
            }
            console.log("Response:: " + JSON.stringify(response));
            res.send(response);
        } else {
            console.log("product: " + JSON.stringify(product[0].product));
            var finalres = [];
            for (key in product) {
                finalres.push(product[key].product);
            }
            response = {
                "count": parseInt(req.query.limit),
                "rows": finalres
            }
            res.status(201).send(response);
        }

    });
});

/* /products/inDepartment/{department_id} Get a list of Products on Department */
router.get('/products/inDepartment/:department_id', function (req, res) {
    console.log('department_id: ' + req.params.department_id);
    var response = {
        "code": "PRD_01",
        "message": "An error occurred",
        "status": "500"
    }

    //Find All
    db.ProductCategory.findAll({
        include: [{
            model: db.Category,
            required: true,
            where: { department_id: req.params.department_id },
            include: [{
                model: db.Product, as: db.ProductCategory,
                required: true
            }]
        }],

    }).then(function (productcategory) {
        if (productcategory.length < 1) {
            response = {
                "code": "PRD_02",
                "message": "Don't exist department with this ID: " + req.params.department_id,
                "status": "500"
            }
            console.log("Response:: " + JSON.stringify(response));
            res.status(400).send(response);
        } else {
            res.status(200).send(productcategory[0].category.products);
        }

    });
});

/* /products/{product_id}/details Get details of a Product*/
router.get('/products/:product_id/details', function (req, res) {
    console.log('product_id: ' + req.params.product_id);
    var response = {
        "code": "PRD_01",
        "message": "An error occurred.",
        "status": "500"
    }

    //Find One
    db.Product.findOne({
        where: { product_id: req.params.product_id }
    }).then(function (product) {
        if (product.length < 1) {
            response = {
                "code": "PRD_02",
                "message": "Product not set up.",
                "status": "500"
            }
            console.log("Response:: " + JSON.stringify(response));
            res.status(400).send(response);
        } else {
            res.status(200).send(product);
        }
    });
});

/* /products/{product_id}/locations Get locations of a Product */
router.get('/products/:product_id/locations', function (req, res) {
    console.log('product_id: ' + req.params.product_id);
    var response = {
        "code": "PRD_01",
        "message": "An error occurred",
        "status": "500"
    }
    //Find One
    db.Department.findOne({
        include: [{
            model: db.Category,
            required: true,
            attributes: ['category_id', 'name', 'department_id'],
            include: [{
                model: db.Product, as: db.ProductCategory,
                required: true,
                where: { product_id: req.params.product_id },
            }]
        }],
        attributes: ['name']
    }).then(function (productcategory) {
        if (productcategory === null) {
            response = {
                "code": "PRD_02",
                "message": "Don't exist product with this ID: " + req.params.product_id,
                "status": "500"
            }
            console.log("Response:: " + JSON.stringify(response));
            res.send(response);
        } else {
            response = {};
            cat = [];
            cat = productcategory.categories;
            console.log("Response:: " + productcategory.name);
            response['department_name'] = productcategory.name;
            response['category_name'] = cat[0].name;
            response['category_id'] = cat[0].category_id;
            response['department_id'] = cat[0].department_id;
            res.status(200).send(response);
        }

    });
});

/* /products/{product_id}/reviews Get reviews of a Product */
router.get('/products/:product_id/reviews', function (req, res) {
    console.log('Req body: ' + req.body);
    var response = {
        "code": "PRD_01",
        "message": "An error occurred.",
        "status": "500"
    }

    if (req.body === undefined) {
        //Find One
        db.Review.findAll({
            where: {
                product_id: req.params.product_id
            }
        }).then(function (reviews) {
            if (reviews.length < 1) {
                var response = {
                    "code": "PROD_02",
                    "message": "Product reviews with this ID: " + req.params.product_id,
                    "status": "500"
                }
                console.log("Response:: " + JSON.stringify(response));
                res.status(400).send(response);
            } else {
                console.log("Response:: " + JSON.stringify(reviews));
                res.status(200).send(reviews);
            }

        });
    } else {  //Post review
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
        db.Customer.findOne({
            where: {
                user_key: req.headers["user-key"].split(" ")[1],
            }
        }).then(function (customer) {
            req.body.customer_id = customer.customer_id;
            //create
            db.Review.create(req.body).then(function (reviews) {
                res.status(201).send(reviews);
            });
        });
    }
});

//export this router to use in our index.js
module.exports = router;