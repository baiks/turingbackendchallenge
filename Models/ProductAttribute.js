module.exports = function (sequelize, DataTypes) {
    var ProductAttribute = sequelize.define('product_attribute', {
        product_id: {
            type: DataTypes.INTEGER(10),
            allowNull: false,
            comment: "Product ID as in product table"
        },
        attribute_value_id: {
            type: DataTypes.INTEGER(10),
            allowNull: false,
            comment: "Attribute value ID as in attribute_value table"
        }
    },
        {
            timestamps: false,
            underscored: true,
            freezeTableName: true,
            tableName: 'product_attribute'
        });

    //Exclude default primary key
    ProductAttribute.removeAttribute('id');
    return ProductAttribute;
};