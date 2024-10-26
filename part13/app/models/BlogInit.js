const { Sequelize, DataTypes, Model } = require("sequelize");

class Blog extends Model {}

const BlogInit = (sequelize) => {
  return Blog.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      author: {
        type: DataTypes.TEXT,
      },
      url: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      title: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      likes: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      underscored: true,
      timestamps: false,
      modelName: "blog",
    }
  );
};

module.exports = BlogInit;
