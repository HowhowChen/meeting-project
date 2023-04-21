'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Countries',
      ['china', 'usa', 'uk']
        .map(item => ({
          name: item,
          created_at: new Date(),
          updated_at: new Date()
        })
        ), {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Countries', null, {})
  }
}
