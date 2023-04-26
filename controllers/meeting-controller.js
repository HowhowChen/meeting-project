const dayjs = require('dayjs')
const EmlParser = require('eml-parser')
const fs = require('fs')
const path = require('path')
const { Op } = require('sequelize')
const { getUser } = require('../helpers/auth-helpers')
const { getOffset, getPagination } = require('../helpers/pagination-helper')
const { Meeting, Platform, Category, Country, Comment, User } = require('../database/models')

const meetingController = {
  getFivePage: async (req, res, next) => {
    try {
      const DEFAULT_LIMIT = 7
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || DEFAULT_LIMIT
      const offset = getOffset(limit, page)
      const categoryId = Number(req.query.categoryId) || ''
      const platformId = Number(req.query.platformId) || ''
      const countryId = Number(req.query.countryId) || ''
      const startDate = req.query.startDate || dayjs().format('YYYY-MM-DD')
      const endDate = req.query.endDate || dayjs().format('YYYY-MM-DD')

      const [meetings, categories, platforms, countries] = await Promise.all([
        Meeting.findAndCountAll({
          raw: true,
          nest: true,
          where: {
            ...categoryId ? { categoryId } : {},
            ...platformId ? { platformId } : {},
            ...countryId ? { countryId } : {},
            meetingDate: {
              [Op.and]: {
                [Op.gte]: startDate,
                [Op.lte]: endDate
              }
            }
          },
          include: [
            {
              model: Platform,
              attributes: ['name']
            },
            {
              model: Category,
              attributes: ['name']
            },
            {
              model: Country,
              attributes: ['name']
            }
          ],
          order: [['id', 'DESC']],
          limit,
          offset
        }),
        Category.findAll({ raw: true }),
        Platform.findAll({ raw: true }),
        Country.findAll({ raw: true })
      ])
      // convert date format
      const newMeetings = meetings.rows.map(meeting => ({
        ...meeting,
        meetingDate: dayjs(meeting.meetingDate).format('YYYY-MM-DD'),
        acceptanceDate: dayjs(meeting.acceptanceDate).format('YYYY-MM-DD')
      }))

      res.locals.layout = 'table.hbs'
      res.render('5th', {
        meetings: newMeetings,
        categories,
        categoryId,
        platforms,
        platformId,
        countries,
        countryId,
        startDate,
        endDate,
        pagination: getPagination(limit, page, meetings.count)
      })
    } catch (err) {
      next(err)
    }
  },
  getFiveMeeting: async (req, res, next) => {
    try {
      const { id } = req.params
      const [meeting, categories, platforms, countries] = await Promise.all([
        Meeting.findOne({
          raw: true,
          nest: true,
          where: { id },
          include: [
            {
              model: Platform,
              attributes: ['name']
            },
            {
              model: Category,
              attributes: ['name']
            },
            {
              model: Country,
              attributes: ['name']
            },
            {
              model: Comment,
              attributes: ['content']
            }
          ]
        }),
        Category.findAll({ raw: true }),
        Platform.findAll({ raw: true }),
        Country.findAll({ raw: true })
      ])

      if (!meeting) throw new Error("Meeting didn't exist!")
      res.locals.layout = 'meeting-update.hbs'
      res.render('meeting-5th', {
        meeting,
        categories,
        platforms,
        countries
      })
    } catch (err) {
      next(err)
    }
  },
  putFiveMeeting: async (req, res, next) => {
    try {
      const { id } = req.params
      const {
        category,
        platform,
        country
      } = req.body
      const meeting = await Meeting.findByPk(id)
      if (!meeting) throw new Error("Meeting can't find!")

      await meeting.update({
        ...req.body,
        categoryId: category,
        platformId: platform,
        countryId: country
      })
      req.flash('success_messages', 'Success Update!')
      res.redirect(`/meetings/5th/${id}`)
    } catch (err) {
      next(err)
    }
  },
  getFiveReport: async (req, res, next) => {
    try {
      const startDate = req.query.startDate || dayjs().format('YYYY-MM-DD')
      const endDate = req.query.endDate || dayjs().format('YYYY-MM-DD')
      const meetings = await Meeting.findAll({
        raw: true,
        nest: true,
        where: {
          importDate: {
            [Op.and]: {
              [Op.gte]: startDate,
              [Op.lte]: endDate
            }
          }
        },
        include: [
          {
            model: Platform,
            attributes: ['name']
          },
          {
            model: Category,
            attributes: ['name']
          },
          {
            model: Country,
            attributes: ['name']
          },
          {
            model: Comment,
            attributes: ['content'],
            include: [{ model: User, attributes: ['name'] }]
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
      res.render('report', {
        meetings: newMeetings,
        startDate,
        endDate
      })
    } catch (err) {
      next(err)
    }
  },
  getSixPage: async (req, res, next) => {
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
          },
          {
            model: Country,
            attributes: ['name']
          },
          {
            model: Comment,
            attributes: ['content'],
            include: [{ model: User, attributes: ['name'] }]
          }
        ],
        order: [['id', 'DESC']]
      })
      // convert date format
      const newMeetings = meetings.map(meeting => ({
        ...meeting,
        meetingDate: dayjs(meeting.meetingDate).format('YYYY-MM-DD'),
        acceptanceDate: dayjs(meeting.acceptanceDate).format('YYYY-MM-DD')
      }))

      res.locals.layout = 'table.hbs'
      res.render('6th', { meetings: newMeetings })
    } catch (err) {
      next(err)
    }
  },
  getSixMeeting: async (req, res, next) => {
    try {
      const { id } = req.params
      const meeting = await Meeting.findOne({
        raw: true,
        nest: true,
        where: { id },
        include: [
          {
            model: Platform,
            attributes: ['name']
          },
          {
            model: Category,
            attributes: ['name']
          },
          {
            model: Country,
            attributes: ['name']
          },
          {
            model: Comment,
            attributes: ['content']
          }
        ]
      })
      if (!meeting) throw new Error("Meeting didn't exist!")

      res.render('meeting-6th', { meeting })
    } catch (err) {
      next(err)
    }
  },
  putSixMeeting: async (req, res, next) => {
    try {
      const { id } = req.params
      const uuid = req.body.uuid.trim()
      const content = req.body.comment.trim()
      const userId = Number(getUser(req).id)
      const [meeting, comment] = await Promise.all([
        Meeting.findByPk(id),
        Comment.findOne({ where: { meetingId: id } })
      ])
      if (!meeting) throw new Error("User didn't exist!")
      if (!comment) {
        await Promise.all([
          meeting.update({ uuid }),
          Comment.create({
            userId,
            meetingId: id,
            content
          })
        ])
      } else {
        await Promise.all([
          meeting.update({ uuid }),
          comment.update({
            userId,
            meetingId: id,
            content
          })
        ])
      }
      res.redirect('/meetings/6th')
    } catch (err) {
      next(err)
    }
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
  },
  getFileContent: async (req, res, next) => {
    try {
      const { fileDate, fileName } = req.params
      const emailFile = fs.createReadStream(path.resolve(process.env.FILE_PATH, dayjs(fileDate).format('YYYYMMDD'), `${fileName}.eml`))
      const content = await new EmlParser(emailFile).parseEml({ ignoreEmbedded: true })

      res.locals.layout = 'email.hbs'
      res.render('emlFile', { content })
    } catch (err) {
      next(err)
    }
  },
  getFileDownload: (req, res, next) => {
    try {
      const { fileDate, fileName } = req.params
      res.download(path.resolve(process.env.FILE_PATH, dayjs(fileDate).format('YYYYMMDD'), `${fileName}.eml`))
    } catch (err) {
      next(err)
    }
  },
  postValue: async (req, res, next) => {
    try {
      const { id } = req.params
      const [meeting, meetingValue] = await Promise.all([
        Meeting.findByPk(id),
        Meeting.findOne({
          where: {
            value: false
          }
        })
      ])
      if (!meeting) throw new Error("Meeting didn't exists!")
      if (!meetingValue) throw new Error('Meeting is already setted value')

      await meeting.update({
        value: true
      })
      res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  deleteValue: async (req, res, next) => {
    try {
      const { id } = req.params
      const [meeting, meetingValue] = await Promise.all([
        Meeting.findByPk(id),
        Meeting.findOne({
          where: {
            value: true
          }
        })
      ])
      if (!meeting) throw new Error("Meeting didn't exists!")
      if (!meetingValue) throw new Error("Meeting didn't be setted value")

      await meeting.update({
        value: false
      })
      res.redirect('back')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = meetingController
