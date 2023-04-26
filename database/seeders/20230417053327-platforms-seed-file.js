'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Platforms',
      ['Zoom', 'Webex', '騰訊']
        .map(item => ({
          name: item,
          created_at: new Date(),
          updated_at: new Date()
        })
        ), {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Platforms', null, {})
  }
}
