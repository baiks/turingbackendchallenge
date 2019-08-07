var Sequelize = require('sequelize');
const Config = require('./../config')
const config = new Config();
var initconfig = JSON.parse(config.config());
const Op = Sequelize.Op;

const sequelizeConnection = new Sequelize(
    initconfig.Database.dbname,
    initconfig.Database.username,
    initconfig.Database.password, {
        host: initconfig.Database.host,
        dialect: initconfig.Database.dialect,
        port: initconfig.Database.port,
        dialectOptions: { connectTimeout: initconfig.Database.connectTimeout }, // mariadb connector option

        pool: {
            max: initconfig.Database.maxpool,
            min: initconfig.Database.minpool,
            idle: initconfig.Database.idle,
            acquire: initconfig.Database.acquire,
        },
        //'mysql'|'mariadb'|'sqlite'|'postgres'|'mssql'
        // SQLite only
        //storage: 'path/to/database.sqlite'
    });

var db = {
    Sequelize: Sequelize,
    sequelize: sequelizeConnection,
    Op: Op,
    config: initconfig
};

db.Department = db.sequelize.import('./Department');
db.Category = db.sequelize.import('./Category');
db.ProductCategory = db.sequelize.import('./ProductCategory');
db.Product = db.sequelize.import('./Product');
db.Attribute = db.sequelize.import('./Attribute');
db.Attributevalue = db.sequelize.import('./Attributevalue');
db.ProductAttribute = db.sequelize.import('./ProductAttribute');
db.Review = db.sequelize.import('./Review');
db.Customer = db.sequelize.import('./Customer');
db.Order = db.sequelize.import('./Order');
db.OrderDetail = db.sequelize.import('./OrderDetail');
db.Shipping = db.sequelize.import('./Shipping');
db.ShippingRegion = db.sequelize.import('./ShippingRegion');
db.ShoppingCart = db.sequelize.import('./ShoppingCart');
db.Tax = db.sequelize.import('./Tax');


/* Relationships */

//Department
db.Department.hasMany(db.Category, { foreignKey: 'department_id' });

//Category
db.Category.belongsTo(db.Department, { foreignKey: 'department_id', onDelete: 'CASCADE' });
db.Category.belongsToMany(db.Product, { through: db.ProductCategory, foreignKey: 'category_id' });

//Product Category
db.ProductCategory.belongsTo(db.Product, { as: 'product', foreignKey: 'product_id', });
db.ProductCategory.belongsTo(db.Category, { foreignKey: 'category_id', });

//Product
db.Product.belongsToMany(db.Category, { through: db.ProductCategory, foreignKey: 'product_id' });
db.Product.belongsToMany(db.Attributevalue, { through: db.ProductAttribute, as: 'attributes', foreignKey: 'product_id' });

//ProductAttribute
db.ProductAttribute.belongsTo(db.Product, { foreignKey: 'product_id' });
db.ProductAttribute.belongsTo(db.Attributevalue, { foreignKey: 'attribute_value_id' });

//Attribute
db.Attribute.hasMany(db.Attributevalue, { foreignKey: 'attribute_id' });

//Attributevalue
db.Attributevalue.belongsTo(db.Attribute, { foreignKey: 'attribute_id', as: 'attribute_type' });
db.Attributevalue.belongsToMany(db.Product, { through: db.ProductAttribute, foreignKey: 'attribute_value_id' });


//Order
db.Order.belongsTo(db.Customer, { foreignKey: 'customer_id' });
db.Order.belongsTo(db.Shipping, { foreignKey: 'shipping_id' });
db.Order.hasMany(db.OrderDetail, { as: 'order_items', foreignKey: 'order_id' });

//Customer
db.Customer.hasMany(db.Order, { foreignKey: 'customer_id' });

//Order details
db.OrderDetail.belongsTo(db.Order, { foreignKey: 'order_id' });

//ShoppingCart
db.ShoppingCart.belongsTo(db.Product, { foreignKey: 'product_id', onDelete: 'CASCADE' });


db.sequelize.sync({ force: false }).then(function (err) {
    console.log("Status:: " + err);
});

module.exports = db;