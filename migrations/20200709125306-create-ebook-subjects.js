'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.createTable('EbookSubjects', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        ebookId: {
          type: Sequelize.INTEGER,
          references: { model: 'Ebooks', key: 'id' }
        },
        subjectId: {
          type: Sequelize.INTEGER,
          references: { model: 'Subjects', key: 'id' }
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
      await queryInterface.addIndex('EbookSubjects', ['ebookId', 'subjectId'], { unique: true, transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('EbookSubjects');
  }
};