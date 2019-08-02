module.exports = function (sequelize, DataTypes) {
    var Attribute = sequelize.define('attribute', {
        attribute_id: {
            field: "attribute_id",
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
            comment: "Attribute name"
        }
    },
        {
            timestamps: false,
            underscored: true,
            freezeTableName: true,
            tableName: 'attribute'
        });

    return Attribute;
};