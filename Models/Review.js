module.exports = function (sequelize, DataTypes) {
    var Review = sequelize.define('review', {
        review_id: {
            type: DataTypes.INTEGER(5),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            comment: "Primary and auto incremented key of the table"
        },
        customer_id: {
            type: DataTypes.INTEGER(5),
            allowNull: false,
            comment: "Foreign key on Customer"
        },
        product_id: {
            type: DataTypes.INTEGER(5),
            allowNull: false,
            comment: "Foreign key on Product"
        }, review: {
            type: DataTypes.STRING(5),
            allowNull: false,
            comment: "Customer review"
        },
        rating: {
            type: DataTypes.INTEGER(5),
            allowNull: false,
            comment: "Customer rating"
        },
        created_on: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        }
    },
        {
            timestamps: false,
            underscored: true,
            freezeTableName: true,
            tableName: 'review'
        });

    return Review;
};