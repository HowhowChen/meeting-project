'use strict'
const faker = require('faker')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const user = await queryInterface.sequelize.query(
      'SELECT "id" FROM "Users" WHERE "name" = $1;',
      {
        bind: ['user2'],
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    )

    const meetings = await queryInterface.sequelize.query(
      'SELECT "id" FROM "Meetings"',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const comments = []
    const meetingArr = []
    let meetingId
    Array.from({ length: 10 }, (_, i) => {
      do {
        meetingId = meetings[Math.floor(Math.random() * meetings.length)].id
      } while (meetingArr.includes(meetingId))
      meetingArr.push(meetingId)
      return comments.push({
        user_id: Number(user[0].id),
        meeting_id: meetingId,
        group: i % 2 === 0 ? '5th' : '6th',
        content: faker.lorem.sentences(2),
        created_at: new Date(),
        updated_at: new Date()
      })
    })
    await queryInterface.bulkInsert('Comments', comments)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Comments', null, {})
  }
}
