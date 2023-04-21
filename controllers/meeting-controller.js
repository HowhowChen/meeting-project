const dayjs = require('dayjs')
const { getUser } = require('../helpers/auth-helpers')
const { Meeting, Platform, Category } = require('../database/models')

const meetingController = {
  getFivePage: async (req, res, next) => {
    try {
      const meetings = await Meeting.findAll({
        raw: true,
        nest: true,
        include: [
          {
            model: Platform,
            attributes: ['name']
          },
          {
            model: Category,
            attributes: ['name']
          }
        ]
      })
      // convert date format
      const newMeetings = meetings.map(meeting => ({
        ...meeting,
        meetingDate: dayjs(meeting.meetingDate).format('YYYY-MM-DD'),
        acceptanceDate: dayjs(meeting.acceptanceDate).format('YYYY-MM-DD')
      }))

      res.locals.layout = 'table.hbs'
      res.render('5th', { meetings: newMeetings })
    } catch (err) {
      next(err)
    }
  },
  getSixPage: (_, res) => {
    res.render('6th')
  },
  getGroupPage: (req, res) => {
    const { group } = getUser(req)
    switch (group) {
      case '5th':
        res.redirect('/meetings/5th')
        break
      case '6th':
        res.redirect('/meetings/6th')
        break
      default:
        res.redirect('/meetings/5th')
    }
  }
}

module.exports = meetingController
