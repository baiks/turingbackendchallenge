module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    'Order',
    {
      order_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      created_on: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      shipped_on: DataTypes.DATE,
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      comments: DataTypes.STRING(255),
      customer_id: DataTypes.INTEGER,
      auth_code: DataTypes.STRING(50),
      reference: DataTypes.STRING(50),
      shipping_id: DataTypes.INTEGER,
      tax_id: DataTypes.INTEGER,
    },
    {
      timestamps: false,
      tableName: 'orders',
    }
  );
  return Order;
};
