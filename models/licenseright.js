'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LicenseRight extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      LicenseRight.belongsToMany(models.Ebook, {
        through: 'EbookLicenseRights',
        foreignKey: 'licenseRightId',
        otherKey: 'ebookId'
      });
    }
  };
  LicenseRight.init({
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'LicenseRight',
  });
  return LicenseRight;
};