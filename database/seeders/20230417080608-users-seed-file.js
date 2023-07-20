'use strict'
const bcrypt = require('bcryptjs')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users',
      [
        {
          name: 'user1',
          account: 'user1',
          password: bcrypt.hashSync(process.env.DEFAULT_PASSWORD, bcrypt.genSaltSync(10)),
          organization: 'the 5th class',
          group: '5th',
          role: 'user',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'user2',
          account: 'user2',
          password: bcrypt.hashSync(process.env.DEFAULT_PASSWORD, bcrypt.genSaltSync(10)),
          organization: 'the 6th class',
          group: '6th',
          role: 'user',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'user3',
          account: 'user3',
          password: bcrypt.hashSync(process.env.DEFAULT_PASSWORD, bcrypt.genSaltSync(10)),
          organization: 'the 7th class',
          group: '7th',
          role: 'user',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'root',
          account: 'root',
          password: bcrypt.hashSync(process.env.DEFAULT_PASSWORD, bcrypt.genSaltSync(10)),
          organization: 'the 5th class',
          group: '5th',
          role: 'admin',
          created_at: new Date(),
          updated_at: new Date()
        }
      ], {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
