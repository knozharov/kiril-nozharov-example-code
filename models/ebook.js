'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ebook extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Ebook.belongsToMany(models.Author, {
        through: 'EbookAuthors',
        foreignKey: 'ebookId',
        otherKey: 'authorId'
      });
      Ebook.Subject = Ebook.belongsToMany(models.Subject, {
        through: 'EbookSubjects',
        foreignKey: 'ebookId',
        otherKey: 'subjectId'
      });
      Ebook.LicenseRight = Ebook.belongsToMany(models.LicenseRight, {
        through: 'EbookLicenseRights',
        foreignKey: 'ebookId',
        otherKey: 'licenseRightId'
      });
    }
  };
  Ebook.init({
    pgId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    publisher: DataTypes.STRING,
    datePublished: DataTypes.DATE,
    language: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Ebook',
  });
  return Ebook;
};