var express = require('express');
var db = require('../Models/DBConnection');
var router = express.Router();

/* /attributes Get Attribute list */
router.get('/attributes', function (req, res) {
    //Find All
    db.Attribute.findAll().then(function (attribute) {
        if (attribute.length < 1) {
            var response = {
                "code": "ATTR_01",
                "message": "Attributes not set up.",
                "status": "500"
            }
            console.log("Response:: " + JSON.stringify(response));
            res.send(response);
        } else {
            console.log("Response:: " + JSON.stringify(attribute));
            res.send(attribute);
        }
    });
})
/* /attributes/{attribute_id} Get Attribute list by ID */
router.get('/attributes/:attribute_id', function (req, res) {
    console.log('attribute_id ' + req.params.attribute_id);
    //Find One
    db.Attribute.findOne({
        where: {
            attribute_id: req.params.attribute_id
        }
    }).then(function (attribute) {
        if (attribute === null) {
            var response = {
                "code": "ATTR_02",
                "message": "Don't exist attribute with this ID: " + req.params.attribute_id,
                "status": "500"
            }
            console.log("Response:: " + JSON.stringify(response));
            res.send(response);
        } else {
            console.log("Response:: " + JSON.stringify(attribute));
            res.send(attribute);
        }

    });
});
/* /attributes/values/{attribute_id} Get Values Attribute from Atribute */
router.get('/attributes/values/:attribute_id', function (req, res) {
    console.log('attribute_id values: ' + req.params.attribute_id);
    var response = {
        "code": "ATTR_01",
        "message": "An error occurred",
        "status": "500"
    }
    //Find All
    db.Attributevalue.findAll({
        exclude: [{
            model: db.Attribute,
            required: true
        }],
        where: {
            attribute_id: req.params.attribute_id
        },
        attributes: ['attribute_value_id', 'value']
    }).then(function (attributevalue) {
        if (attributevalue.length < 1) {
            response = {
                "code": "ATTR_02",
                "message": "Don't exist attribute with this ID: " + req.params.attribute_id,
                "status": "500"
            }
            console.log("Response:: " + JSON.stringify(response));
            res.send(response);
        } else {
            //response = attributevalue[0].attributevalue;
            console.log("Response:: " + JSON.stringify(attributevalue[0]));
            res.send(attributevalue);
        }

    });
});

/* /attributes/inProduct/{product_id} Get all Attributes with Produt ID */
router.get('/attributes/inProduct/:product_id', function (req, res) {
    console.log('product_id id: ' + req.params.product_id);
    var response = {
        "code": "ATTR_01",
        "message": "An error occurred",
        "status": "500"
    }
    //Find All
    db.ProductAttribute.findAll({
        include: [{
            model: db.Attributevalue,
            required: true,
            attributes: ['attribute_value_id', ['value', 'attribute_value']],
            include: [{
                model: db.Attribute, as: 'attribute_type',
                required: true,
                attributes: [['name', 'attribute_name']],
            }]
        }],
        where: {
            product_id: req.params.product_id
        },
        attributes: { exclude: ['product_id'] }
    }).then(function (productattribute) {
        if (productattribute.length < 1) {
            response = {
                "code": "ATTR_02",
                "message": "Don't exist product with this ID: " + req.params.product_id,
                "status": "500"
            }
            console.log("Response:: " + JSON.stringify(response));
            res.send(response);
        } else {

            var jsonarryres = [];
            for (key in productattribute) {
                jsonarryres.push(productattribute[key].attribute_value);
            }
            res.send(jsonarryres);
        }
    });
});

//export this router to use in our index.js
module.exports = router;