var express = require('express');
var app = express();

var testing = require('./testing.js');
var department = require('./apis/department.js');
var categories = require('./apis/categories.js');
var attributes = require('./apis/attributes.js');
var product = require('./apis/product.js');
var customer = require('./apis/customer.js');
var orders = require('./apis/orders.js');
var shoppingcart = require('./apis/shoppingcart.js');
var tax = require('./apis/tax.js');
var shippingregions = require('./apis/shippingregions.js');


//Define routes here
app.use('/',
    testing,
    department,
    categories,
    attributes,
    product,
    customer,
    orders,
    shoppingcart,
    tax,
    shippingregions
);

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("TshirtshopAPI listening at http://%s:%s", host, port)
})