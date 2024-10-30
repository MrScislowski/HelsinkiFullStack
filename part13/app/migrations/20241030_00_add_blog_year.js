const { DataTypes } = require("sequelize");

// // For auto completion on editor
// const { sequelize } = require("../utils/db");
// const queryInterface = sequelize.getQueryInterface();

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn("blogs", "year", {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1991,
        max: new Date().getFullYear(),
      },
    });
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn("blogs", "year");
  },
};
