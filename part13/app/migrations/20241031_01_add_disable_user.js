const { DataTypes } = require("sequelize");

// For auto completion on editor
const { sequelize } = require("../utils/db");
const queryInterface = sequelize.getQueryInterface();

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn("users", "disabled", {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    });
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn("users", "disabled");
  },
};
