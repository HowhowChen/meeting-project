'use strict'

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
      'SELECT "id", "import_date" FROM "Meetings"',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const values = []
    meetings.forEach(meeting => {
      if (meeting.id % 2 !== 0) {
        return values.push({
          user_id: Number(user[0].id),
          meeting_id: Number(meeting.id),
          is_value: true,
          created_at: new Date(),
          updated_at: new Date()
        })
      }
    })
    await queryInterface.bulkInsert('Values', values)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Values', null, {})
  }
}
