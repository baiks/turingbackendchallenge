module.exports = function (sequelize, DataTypes) {
    var Attributevalue = sequelize.define('attribute_value', {
        attribute_value_id: {
            field: "attribute_value_id",
            type: DataTypes.INTEGER(5),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            comment: "Primary and auto incremented key of the table"
        },
        attribue_id: {
            type: DataTypes.INTEGER(5),
            allowNull: false,
            comment: "Foreign key on Attribute"
        },
        value: {
            field: "value",
            type: DataTypes.STRING,
            allowNull: false,
            comment: "Attribute value"
        }
    },
        {
            timestamps: false,
            underscored: true,
            freezeTableName: true,
            tableName: 'attribute_value'
        });

    return Attributevalue;
};