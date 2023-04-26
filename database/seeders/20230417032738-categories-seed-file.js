'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Categories',
      ['論壇', '學術', '智庫']
        .map(item => ({
          name: item,
          created_at: new Date(),
          updated_at: new Date()
        })
        ), {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', null, {})
  }
}
