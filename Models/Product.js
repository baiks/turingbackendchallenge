module.exports = function(sequelize, DataTypes) {
    var Product = sequelize.define('product', {
        product_id: {
        type: DataTypes.INTEGER(5),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        comment: "Primary and auto incremented key of the table"
      },
      name: {
        field: "name",
        type: DataTypes.STRING,
        allowNull: false,
        comment: "Product name"
      },
      description: {
        field: "description",
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: "Product description"
      },
      price: {
        field: "price",
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: "Product price"
      },
      discounted_price: {
        field: "discounted_price",
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: "Product discounted price"
      },
      image: {
        field: "image",
        type: DataTypes.STRING,
        allowNull: false,
        comment: "Product image"
      },
      image2: {
        field: "image_2",
        type: DataTypes.STRING,
        allowNull: false,
        comment: "Product image_2"
      },
      thumbnail: {
        field: "thumbnail",
        type: DataTypes.STRING,
        allowNull: false,
        comment: "Product thumbnail"
      },
      display: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        comment: "Product Display"
      },
    },
    {
      timestamps: false,
      underscored: true,
      freezeTableName:true,
      tableName:'product'
    });
  
    return Product;
  };