'use strict'
const faker = require('faker')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const categories = await queryInterface.sequelize.query(
      'SELECT "id" FROM "Categories"',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const platforms = await queryInterface.sequelize.query(
      'SELECT "id" FROM "Platforms"',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const countries = await queryInterface.sequelize.query(
      'SELECT "id" FROM "Countries"',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    await queryInterface.bulkInsert('Meetings', Array.from({
      length: 10
    }, (_, i) => ({
      name: faker.lorem.sentences(1),
      sender: faker.internet.email(),
      receiver: faker.internet.email(),
      category_id: categories[Math.floor(Math.random() * categories.length)].id,
      platform_id: platforms[Math.floor(Math.random() * platforms.length)].id,
      country_id: countries[Math.floor(Math.random() * countries.length)].id,
      meeting_date: new Date(),
      acceptance_date: new Date(),
      organization: 'NSA',
      link: 'https://example.com',
      password: '12345678',
      file_name: 'test',
      value: i % 2 === 0,
      created_at: new Date(),
      updated_at: new Date()
    })))
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Meetings', null, {})
  }
}
