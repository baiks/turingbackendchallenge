module.exports = function (sequelize, DataTypes) {
  var Department = sequelize.define('department', {
    department_id: {
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
    }
  },
    {
      timestamps: false,
      underscored: true,
      freezeTableName: true,
      tableName: 'department',
      classMethods: {
        associate: function (models) {
          db.Department.hasMany(models.Category, {
            foreignKey: 'department_id',
          });
        }
      }
    });

  return Department;
};