const dayjs = require('dayjs')
const EmlParser = require('eml-parser')
const fs = require('fs')
const path = require('path')
const { Op, QueryTypes } = require('sequelize')
const { getUser } = require('../helpers/auth-helpers')
const { getOffset, getPagination } = require('../helpers/pagination-helper')
const { Meeting, Platform, Category, Country, Comment, User, Value, Issue, MeetingIssue, sequelize } = require('../database/models')
const DEFAULT_LIMIT = 7

const meetingController = {
  getFivePage: async (req, res, next) => {
    try {
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
            },
            {
              model: Value,
              attributes: ['isValue']
            }
          ],
          order: [['meetingDate', 'DESC']],
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
      const [meeting, categories, platforms, countries, issues] = await Promise.all([
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
            },
            {
              model: MeetingIssue,
              include: [Issue]
            }
          ]
        }),
        Category.findAll({ raw: true }),
        Platform.findAll({ raw: true }),
        Country.findAll({ raw: true }),
        Issue.findAll({ raw: true })
      ])

      if (!meeting) throw new Error("Meeting didn't exist!")
      res.locals.layout = 'meeting-update.hbs'
      res.render('meeting-5th', {
        meeting,
        categories,
        platforms,
        countries,
        issues
      })
    } catch (err) {
      next(err)
    }
  },
  putFiveMeeting: async (req, res, next) => {
    try {
      const { id } = req.params
      const issueId = Number(req.body.issueId)
      const {
        category,
        platform,
        country
      } = req.body
      const [meeting, issue, meetingIssue] = await Promise.all([
        Meeting.findByPk(id),
        Issue.findByPk(issueId),
        MeetingIssue.findOne({
          where: {
            meetingId: id
          }
        })
      ])

      if (!meeting) throw new Error("Meeting can't find!")
      if (!issue) throw new Error("Issue can't find!")
      if (!meetingIssue) {
        await Promise.all([
          meeting.update({
            ...req.body,
            categoryId: category,
            platformId: platform,
            countryId: country
          }),
          MeetingIssue.create({
            meetingId: id,
            issueId
          })
        ])
      } else {
        await Promise.all([
          meeting.update({
            ...req.body,
            categoryId: category,
            platformId: platform,
            countryId: country
          }),
          meetingIssue.update({
            meetingId: id,
            issueId
          })
        ])
      }

      req.flash('success_messages', 'Success Update!')
      res.redirect(`/meetings/5th/${id}`)
    } catch (err) {
      next(err)
    }
  },
  getFiveReport: async (req, res, next) => {
    try {
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || DEFAULT_LIMIT
      const offset = getOffset(limit, page)
      const startDate = req.query.startDate || dayjs().format('YYYY-MM-DD')
      const endDate = req.query.endDate || dayjs().format('YYYY-MM-DD')
      const meetings = await Meeting.findAndCountAll({
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
          },
          {
            model: Value,
            attributes: ['isValue']
          }
        ],
        limit,
        offset,
        order: [['importDate', 'DESC']]
      })
      // convert date format
      const newMeetings = meetings.rows.map(meeting => ({
        ...meeting,
        meetingDate: dayjs(meeting.meetingDate).format('YYYY-MM-DD'),
        acceptanceDate: dayjs(meeting.acceptanceDate).format('YYYY-MM-DD')
      }))

      res.locals.layout = 'table.hbs'
      res.render('report', {
        meetings: newMeetings,
        startDate,
        endDate,
        pagination: getPagination(limit, page, meetings.count)
      })
    } catch (err) {
      next(err)
    }
  },
  getSixPage: async (req, res, next) => {
    try {
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
          attributes: [
            'id', 'meetingDate', 'uuid', 'name', 'organization', 'sender', 'receiver'
          ],
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
            },
            {
              model: Value,
              attributes: ['isValue'],
              include: [{ model: User, attributes: ['name'] }]
            }
          ],
          offset,
          limit,
          order: [['meetingDate', 'DESC']]
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
      res.render('6th', {
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
  getSixMeeting: async (req, res, next) => {
    try {
      const { id } = req.params
      const meeting = await sequelize.query(
        `
        SELECT
          M."id",
          M."name",
          M."uuid",
          M."content" AS meeting_content, 
          C."content" AS comment_content 
        FROM "Meetings" AS M
          LEFT JOIN "Comments" AS C
          ON C."meeting_id" = M."id"
        WHERE M."id" = :id
        `,
        {
          replacements: { id: id },
          type: QueryTypes.SELECT
        }
      )
      if (!meeting.length) throw new Error("Meeting didn't exist!")

      res.render('meeting-6th', { meeting: meeting[0] })
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
      const userId = Number(getUser(req).id)
      const [meeting, meetingValue] = await Promise.all([
        Meeting.findByPk(id),
        Value.findOne({
          where: { meetingId: Number(id) }
        })
      ])

      if (!meeting) throw new Error("Meeting didn't exists!")
      if (meetingValue) throw new Error('Meeting is already setted value')

      await Value.create({
        userId,
        meetingId: Number(id),
        isValue: true
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
        Value.findOne({
          where: {
            meetingId: Number(id),
            isValue: true
          }
        })
      ])
      if (!meeting) throw new Error("Meeting didn't exists!")
      if (!meetingValue) throw new Error("Meeting didn't be setted value")

      await meetingValue.destroy()
      res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  getMeetingIssues: async (req, res, next) => {
    try {
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || DEFAULT_LIMIT
      const offset = getOffset(limit, page)
      const startDate = req.query.startDate || dayjs().format('YYYY-MM-DD')
      const endDate = req.query.endDate || dayjs().format('YYYY-MM-DD')
      const issue = req.query?.issue ? `%${req.query?.issue}%` : '%%'

      const [issues, issueCount] = await Promise.all([
        sequelize.query(
          `
          SELECT "id", "name", 
          ( 
            SELECT
              (
                SELECT "meeting_date"
                FROM "Meetings" AS M
                WHERE M."id" = MI."meeting_id"
                LIMIT 1
              )
            FROM "MeetingIssues" AS MI 
            WHERE I."id" = MI."id"
          ) 
          FROM "Issues" AS I
          WHERE I."name" LIKE :issue
          AND 
          ( 
            SELECT
              (
                SELECT "meeting_date"
                FROM "Meetings" AS M
                WHERE M."id" = MI."meeting_id"
                AND M."meeting_date" >= :startDate
                AND M."meeting_date" <= :endDate
                LIMIT 1
              )
            FROM "MeetingIssues" AS MI 
            WHERE I."id" = MI."id"
          ) IS NOT NULL
          LIMIT  :limit
          OFFSET :offset
          
          `,
          {
            replacements: {
              issue: issue,
              startDate: startDate,
              endDate: endDate,
              limit: limit,
              offset: offset
            },
            type: QueryTypes.SELECT
          }
        ),
        sequelize.query(
          `
          SELECT COUNT("id")
          FROM "Issues" AS I
          WHERE I."name" LIKE :issue
          AND 
          ( 
            SELECT
              (
                SELECT "meeting_date"
                FROM "Meetings" AS M
                WHERE M."id" = MI."meeting_id"
                AND M."meeting_date" >= :startDate
                AND M."meeting_date" <= :endDate
                LIMIT 1
              )
            FROM "MeetingIssues" AS MI 
            WHERE I."id" = MI."id"
          ) IS NOT NULL
          `,
          {
            replacements: {
              issue: issue,
              startDate: startDate,
              endDate: endDate
            },
            type: QueryTypes.SELECT
          }
        )
      ])

      res.locals.layout = 'table.hbs'
      res.render('meeting-issues', {
        issues,
        startDate,
        endDate,
        issue: req.query.issue,
        pagination: getPagination(limit, page, issueCount[0].count)
      })
    } catch (err) {
      next(err)
    }
  },
  getMeetingIssue: async (req, res, next) => {
    try {
      const issueId = Number(req.params.id)
      const meetingIssue = await sequelize.query(
        `
        SELECT *,
        (
          SELECT "name"
          FROM "Issues"
          WHERE "Issues"."id" = "MeetingIssues"."issue_id"
        )AS issue_name,
        (
          SELECT "is_value"
          FROM "Values"
          WHERE "Values"."meeting_id" = "Meetings"."id"
        )
        FROM "MeetingIssues"
        INNER JOIN "Meetings"
        ON "MeetingIssues"."meeting_id" = "Meetings"."id"
        WHERE "MeetingIssues"."issue_id" = $1
        ORDER BY "meeting_date" DESC
        `,
        {
          bind: [issueId],
          type: QueryTypes.SELECT
        }
      )

      res.locals.layout = 'table.hbs'
      res.render('meeting-issue', {
        meetingIssue
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = meetingController
