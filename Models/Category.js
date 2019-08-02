module.exports = function (sequelize, DataTypes) {
    var Category = sequelize.define('category', {
        category_id: {
            field: "category_id",
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
            comment: "Department name"
        },
        description: {
            field: "description",
            type: DataTypes.STRING,
            allowNull: false,
            comment: "Department description"
        },
        department_id: {
            type: DataTypes.INTEGER(5),
            allowNull: false,
            comment: "Foreign key on Department"
        }
    },
        {
            timestamps: false,
            underscored: true,
            freezeTableName: true,
            tableName: 'category'
        });

    return Category;
};