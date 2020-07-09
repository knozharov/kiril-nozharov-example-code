'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.createTable('Ebooks', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        pgId: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        title: {
          type: Sequelize.STRING(512),
          unique: true
        },
        publisher: {
          type: Sequelize.STRING
        },
        datePublished: {
          type: Sequelize.DATE
        },
        language: {
          type: Sequelize.STRING
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      }, { transaction });

      await queryInterface.addIndex('Ebooks', ['title', 'datePublished', 'language'], { unique: true, transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Ebooks');
  }
};