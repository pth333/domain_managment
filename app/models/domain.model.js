module.exports = (sequelize, Sequelize) => {
  const Domain = sequelize.define(
    "domain",
    {
      domain: {
        type: Sequelize.STRING,
      },
      link_domain: {
        type: Sequelize.STRING,
      },
      account: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      key_app: {
        type: Sequelize.STRING,
      },
      price: {
        type: Sequelize.STRING,
      },
      currency: {
        type: Sequelize.STRING,
      },
      date_of_purchase: {
        type: Sequelize.DATEONLY,
      },
      expiration_date: {
        type: Sequelize.NUMBER,
      },
      status: {
        type: Sequelize.STRING,
      },
      company: {
        type: Sequelize.STRING,
      },
      manager: {
        type: Sequelize.STRING,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      paranoid: true, // Bật tính năng xóa mềm
    }
  );

  return Domain;
};
