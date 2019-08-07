var express = require('express');
var db = require('../Models/DBConnection');
var router = express.Router();

/* /categories Get Categories*/
router.get('/categories', function (req, res) {
    var response = {
        "code": "CAT_01",
        "message": "An error occurred.",
        "status": "500"
    }
    if (req.query.limit === undefined) {
        req.query.limit = 20;
    } if (req.query.page === undefined) {
        req.query.page = 1;
    }
    console.log("Limit: " + req.query.limit);
    console.log("Page: " + req.query.page);
    console.log("Order: " + req.query.order);

    //Find All
    db.Category.findAll({
        offset: parseInt(req.query.page), limit: parseInt(req.query.limit),
        order: [["name", req.query.order], ["category_id", req.query.order]]
    }).then(function (category) {
        if (category.length < 1) {
            response = {
                "code": "CAT_01",
                "message": "Categories not set up.",
                "status": "500"
            }
            console.log("Response:: " + JSON.stringify(response));
            res.send(response);
        } else {
            console.log("Response:: " + JSON.stringify(category));
            response = {
                "count": parseInt(req.query.limit),
                "rows": category
            }
            res.send(response);
        }
    }).catch((err) => {
        res.status(400).send(err);
    });
});
/* /categories/{category_id} Get Category by ID */
router.get('/categories/:category_id', function (req, res) {
    var response = {
        "code": "CAT_01",
        "message": "An error occurred.",
        "status": "500"
    }
    //Find One
    db.Category.findOne({
        where: {
            category_id: req.params.category_id
        }
    }).then(function (category) {
        if (category === null) {
            var response = {
                "code": "DEP_02",
                "message": "Don't exist category with this ID: " + req.params.category_id,
                "status": "500"
            }
            console.log("Response:: " + JSON.stringify(response));
            res.send(response);
        } else {
            console.log("Response:: " + JSON.stringify(category));
            res.send(category);
        }
    }).catch((err) => {
        res.status(400).send(err);
    });
});

/* /categories/inProduct/{product_id} Get Categories of a Product */
router.get('/categories/inProduct/:product_id', function (req, res) {
    var response = {
        "code": "CAT_01",
        "message": "An error occurred",
        "status": "500"
    }
    //Find All
    db.ProductCategory.findAll({
        include: [{
            model: db.Category,
            required: true,
            attributes: ['category_id', 'department_id', 'name']
        }],
        where: {
            product_id: req.params.product_id
        },
        attributes: { exclude: ['product_product_id'] }
    }).then(function (category) {
        if (category.length < 1) {
            response = {
                "code": "CAT_01",
                "message": "Don't exist product with this ID: " + req.params.product_id,
                "status": "500"
            }
            console.log("Response:: " + JSON.stringify(response));
            res.send(response);
        } else {
            response = [category[0].category];
            console.log("Response:: " + JSON.stringify(response));
            res.send(response);
        }

    }).catch((err) => {
        res.status(400).send(err);
    });
});
/* /categories/inDepartment/{inDepartment} Get Categories of a Department */
router.get('/categories/inDepartment/:department_id', function (req, res) {
    console.log("");
    var response = {
        "code": "CAT_02",
        "message": "An error occurred",
        "status": "500"
    }

    //Find All
    db.Category.findAll({
        where: {
            department_id: req.params.department_id
        },
        attributes: ['category_id', 'name', 'department_id', 'name', 'description']
    }).then(function (category) {
        if (category.length < 1) {
            response = {
                "code": "CAT_02",
                "message": "Category with ID: " + req.params.department_id + " does not exist",
                "status": "500"
            }
            console.log("Response:: " + JSON.stringify(response));
            res.send(response);
        } else {
            response = [category[0].category]
            console.log("Response:: " + JSON.stringify(response));
            res.send(category);
        }

    }).catch((err) => {
        res.status(400).send(err);
    });
});

//export this router to use in our index.js
module.exports = router;