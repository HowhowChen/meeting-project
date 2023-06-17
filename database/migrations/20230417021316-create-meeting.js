'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Meetings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      category_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      platform_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      country_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.TEXT
      },
      content: {
        type: Sequelize.TEXT
      },
      uuid: {
        type: Sequelize.STRING
      },
      sender: {
        type: Sequelize.STRING
      },
      receiver: {
        type: Sequelize.TEXT
      },
      meeting_date: {
        type: Sequelize.STRING
      },
      acceptance_date: {
        type: Sequelize.STRING
      },
      import_date: {
        type: Sequelize.STRING
      },
      export_date: {
        type: Sequelize.STRING
      },
      organization: {
        type: Sequelize.STRING
      },
      link: {
        type: Sequelize.TEXT
      },
      password: {
        type: Sequelize.STRING
      },
      file_name: {
        type: Sequelize.STRING
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Meetings')
  }
}
