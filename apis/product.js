var express = require('express');
var db = require('../Models/DBConnection');
var router = express.Router();

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
            res.send(response);
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
            res.send(response);
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
            res.send(response);
        } else {
            res.send(product);
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
            res.send(response);
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
            res.send(response);
        } else {
            res.send(productcategory[0].category.products);
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
            res.send(response);
        } else {
            res.send(product);
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
            res.send(response);
        }

    });
});

/* /products/{product_id}/reviews Get reviews of a Product */
router.get('/products/:product_id/reviews', function (req, res) {
    console.log('products: ' + req.params.product_id);
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
            res.send(response);
        } else {
            console.log("Response:: " + JSON.stringify(reviews));
            res.send(reviews);
        }

    });
});
/* /products/{product_id}/reviews Getreviews */
router.post('/products/:product_id/reviews', function (req, res) {
    console.log('product_id: ' + req.params.product_id);
    console.log('review : ' + req.query.review);
    console.log('rating  : ' + req.query.rating);
    //Find One
    db.Review.findAll({
        where: {
            product_id: req.params.product_id,
            review: req.query.review,
            rating: req.query.rating
        }
    }).then(function (reviews) {
        if (reviews.length < 1) {
            var response = {
                "code": "PROD_02",
                "message": "Product reviews not found",
                "status": "500"
            }
            console.log("Response:: " + JSON.stringify(response));
            res.send(response);
        } else {
            console.log("Response:: " + JSON.stringify(reviews));
            res.send(reviews);
        }

    });
});

//export this router to use in our index.js
module.exports = router;