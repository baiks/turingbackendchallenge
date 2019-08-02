module.exports = function(sequelize, DataTypes) {
    var ProductCategory = sequelize.define('product_category', {
        category_id: {
        type: DataTypes.INTEGER(10),
        allowNull: false,
        comment: "Category ID as in category table"
      },
      product_id: {
        type: DataTypes.INTEGER(10),
        allowNull: false,
        comment: "Product ID as in product table"
      }
    },
    {
      timestamps: false,
      underscored: true,
      freezeTableName:true,
      tableName:'product_category'
    });

    //Exclude default primary key
    ProductCategory.removeAttribute('id');
    return ProductCategory;
  };