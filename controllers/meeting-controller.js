const dayjs = require('dayjs')
const EmlParser = require('eml-parser')
const fs = require('fs')
const path = require('path')
const { QueryTypes } = require('sequelize')
const { getUser } = require('../helpers/auth-helpers')
const { getOffset, getPagination } = require('../helpers/pagination-helper')
const { Meeting, Platform, Category, Country, Comment, Value, Issue, MeetingIssue, Minute, sequelize } = require('../database/models')
const DEFAULT_LIMIT = 7

const meetingController = {
  getFivePage: async (req, res, next) => {
    try {
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || DEFAULT_LIMIT
      const offset = getOffset(limit, page)
      const categoryId = Number(req.query.categoryId) || null
      const platformId = Number(req.query.platformId) || null
      const countryId = Number(req.query.countryId) || null
      const startDate = req.query.startDate || dayjs().format('YYYY-MM-DD')
      const endDate = req.query.endDate || dayjs().format('YYYY-MM-DD')
      const selectDateType = req.query.selectDateType || 'meeting'

      const [meetings, meetingCount, categories, platforms, countries] = await Promise.all([
        sequelize.query(
          `
          SELECT 
            M."id",
            V."is_value",
            M."acceptance_date",
            M."meeting_date",
            P."name" AS platform_name,
            M."name",
            M."organization",
            M."link",
            M."password",
            M."file_name"
          FROM "Meetings" AS M
          LEFT JOIN "Values" AS V
            ON V."meeting_id" = M."id"
          LEFT JOIN "Platforms" AS P
            ON P."id" = M."platform_id"
          WHERE 
            (
              CASE
                WHEN :selectDateType = 'meeting'
                THEN M."meeting_date" >= :startDate AND
                    M."meeting_date" <= :endDate
                ELSE M."acceptance_date" >= :startDate AND
                    M."acceptance_date" <= :endDate
              END
            )
          AND
            (
              CASE
                WHEN :categoryId IS NOT NULL
                THEN M."category_id" = :categoryId
                ELSE M."category_id" in
                (
                  SELECT "id"
                  FROM "Categories"
                )
              END
            )
          AND 
            (
              CASE
                WHEN :platformId IS NOT NULL 
                  THEN M."platform_id" = :platformId
                  ELSE M."platform_id" in 
                  (
                  SELECT "id"
                  FROM "Platforms"
                )
                END
            )
          AND
            (
              CASE
                WHEN :countryId IS NOT NULL
                THEN M."country_id" = :countryId
                ELSE M."country_id" in
                (
                  SELECT "id"
                  FROM "Countries"
                )
              END
            )
          ORDER BY M."meeting_date" DESC
          LIMIT  :limit
          OFFSET :offset
          `,
          {
            replacements: {
              selectDateType: selectDateType,
              startDate: startDate,
              endDate: endDate,
              categoryId: categoryId,
              platformId: platformId,
              countryId: countryId,
              limit: limit,
              offset: offset
            },
            type: QueryTypes.SELECT
          }
        ),
        sequelize.query(
          `
          SELECT COUNT(M."id")
          FROM "Meetings" AS M
          WHERE 
            (
              CASE
                WHEN :selectDateType = 'meeting'
                THEN M."meeting_date" >= :startDate AND
                    M."meeting_date" <= :endDate
                ELSE M."acceptance_date" >= :startDate AND
                    M."acceptance_date" <= :endDate
              END
            )
          AND
            (
              CASE
                WHEN :categoryId IS NOT NULL
                THEN M."category_id" = :categoryId
                ELSE M."category_id" in
                (
                  SELECT "id"
                  FROM "Categories"
                )
              END
            )
          AND 
            (
              CASE
                WHEN :platformId IS NOT NULL 
                  THEN M."platform_id" = :platformId
                  ELSE M."platform_id" in 
                  (
                  SELECT "id"
                  FROM "Platforms"
                )
                END
            )
          AND
            (
              CASE
                WHEN :countryId IS NOT NULL
                THEN M."country_id" = :countryId
                ELSE M."country_id" in
                (
                  SELECT "id"
                  FROM "Countries"
                )
              END
            )
          `,
          {
            replacements: {
              selectDateType: selectDateType,
              startDate: startDate,
              endDate: endDate,
              categoryId: categoryId,
              platformId: platformId,
              countryId: countryId
            },
            type: QueryTypes.SELECT
          }
        ),
        sequelize.query(
          `
          SELECT "id", "name"
          FROM "Categories"
          `,
          {
            type: QueryTypes.SELECT
          }
        ),
        sequelize.query(
          `
          SELECT "id", "name"
          FROM "Platforms"
          `,
          {
            type: QueryTypes.SELECT
          }
        ),
        sequelize.query(
          `
          SELECT "id", "name"
          FROM "Countries"
          `,
          {
            type: QueryTypes.SELECT
          }
        )
      ])

      // convert date format
      const newMeetings = meetings.map(meeting => ({
        ...meeting,
        name: meeting.name.length > 50 ? meeting.name.substring(0, 50) + '...' : meeting.name,
        link: meeting.link.length > 50 ? meeting.link.substring(0, 50) + '...' : meeting.link,
        meeting_date: dayjs(meeting.meeting_date).format('YYYY-MM-DD'),
        acceptance_date: dayjs(meeting.acceptance_date).format('YYYY-MM-DD')
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
        selectDateType,
        pagination: getPagination(limit, page, meetingCount[0].count)
      })
    } catch (err) {
      next(err)
    }
  },
  getFiveMeeting: async (req, res, next) => {
    try {
      const { id } = req.params
      const [meeting, categories, platforms, countries, issues] = await Promise.all([
        sequelize.query(
          `
          SELECT 
            M."id",
            M."name",
            M."content",
            M."organization",
            M."sender",
            M."receiver",
            M."meeting_date",
            M."acceptance_date",
            M."import_date",
            M."export_date",
            M."link",
            M."password",
            M."file_name",
            M."uuid",
            CA."name" AS category_name,
            P."name" AS platform_name,
            C."name" AS country_name,
            (
              SELECT I."name" AS issue_name
              FROM "Issues" AS I
              WHERE I."id" = MI."issue_id"
            ),
            (
              SELECT CM."content"
              FROM "Comments" AS CM
              RIGHT JOIN "Users" AS U
              ON U."id" = CM."user_id"
              WHERE CM."meeting_id" = M."id"
              AND CM."group" = '5th'
            ) AS comment_content_5th
          FROM "Meetings" AS M
          LEFT JOIN "Categories" AS CA
          ON CA."id" = M."category_id"
          LEFT JOIN "Platforms" AS P
          ON P."id" = M."platform_id"
          LEFT JOIN "Countries" AS C
          ON C."id" = M."country_id"
          LEFT JOIN "MeetingIssues" AS MI
          ON MI."meeting_id" = M."id"
          WHERE M."id" = :id
          `,
          {
            replacements: { id: id },
            type: QueryTypes.SELECT
          }
        ),
        Category.findAll({ raw: true }),
        Platform.findAll({ raw: true }),
        Country.findAll({ raw: true }),
        Issue.findAll({ raw: true })
      ])

      if (!meeting) throw new Error("Meeting didn't exist!")
      res.locals.layout = 'meeting-update.hbs'
      res.render('meeting-5th', {
        meeting: meeting[0],
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
      const userId = Number(getUser(req).id)
      const { id } = req.params

      const {
        category,
        platform,
        country
      } = req.body
      const issueId = Number(req.body.issueId)
      const content = req.body.comment.trim()

      const [meeting, issue, meetingIssue, comment] = await Promise.all([
        Meeting.findByPk(id),
        Issue.findByPk(issueId),
        MeetingIssue.findOne({
          where: {
            meetingId: id
          }
        }),
        Comment.findOne({ where: { meetingId: id, group: '5th' } })
      ])

      if (!meeting) throw new Error("Meeting can't find!")
      if (!issue) {
        await meeting.update({
          ...req.body,
          categoryId: category,
          platformId: platform,
          countryId: country
        })

        if (!comment) {
          await Comment.create({
            userId,
            meetingId: id,
            group: '5th',
            content
          })
        } else {
          await comment.update({
            userId,
            content
          })
        }

        req.flash('success_messages', 'Success Update!')
        return res.redirect(`/meetings/5th/${id}`)
      }

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

      if (!comment) {
        await Comment.create({
          userId,
          meetingId: id,
          group: '5th',
          content
        })
      } else {
        await comment.update({
          userId,
          content
        })
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

      const [meetings, meetingCount] = await Promise.all([
        sequelize.query(
          `
          SELECT 
            M."import_date",
            M."export_date",
            M."acceptance_date",
            M."meeting_date",
            M."name",
            M."organization",
            M."uuid",
            C."name" AS country_name,
            P."name" AS platform_name,
            V."is_value",
            (
              SELECT CM."content"
              FROM "Comments" AS CM
              RIGHT JOIN "Users" AS U
              ON U."id" = CM."user_id"
              WHERE CM."meeting_id" = M."id"
              AND CM."group" = '5th'
            ) AS comment_content_5th,
            (
              SELECT CM."content"
              FROM "Comments" AS CM
              RIGHT JOIN "Users" AS U
              ON U."id" = CM."user_id"
              WHERE CM."meeting_id" = M."id"
              AND CM."group" = '6th'
            ) AS comment_content_6th
          FROM "Meetings" AS M
          LEFT JOIN "Values" AS V
            ON V."meeting_id" = M."id"
          LEFT JOIN "Countries" AS C
            ON C."id" = M."country_id"
          LEFT JOIN "Platforms" AS P
            ON P."id" = M."platform_id"
          WHERE 
            M."import_date" >= :startDate
            AND M."import_date" <= :endDate
          ORDER BY M."import_date" DESC
          LIMIT  :limit
          OFFSET :offset
          `,
          {
            replacements: {
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
          SELECT COUNT(*)
          FROM "Meetings" AS M
          WHERE 
            M."import_date" >= :startDate AND
            M."import_date" <= :endDate
          `,
          {
            replacements: {
              startDate: startDate,
              endDate: endDate
            },
            type: QueryTypes.SELECT
          }
        )
      ])
      // convert date format
      const newMeetings = meetings.map(meeting => ({
        ...meeting,
        name: meeting.name.length > 50 ? meeting.name.substring(0, 50) + '...' : meeting.name,
        meeting_date: dayjs(meeting.meeting_date).format('YYYY-MM-DD'),
        acceptance_date: dayjs(meeting.acceptance_date).format('YYYY-MM-DD')
      }))

      res.locals.layout = 'table.hbs'
      res.render('report', {
        meetings: newMeetings,
        startDate,
        endDate,
        pagination: getPagination(limit, page, meetingCount[0].count)
      })
    } catch (err) {
      next(err)
    }
  },
  getFiveAnalysis: async (req, res, next) => {
    try {
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || DEFAULT_LIMIT
      const offset = getOffset(limit, page)
      const startDate = req.query.startDate || dayjs().format('YYYY-MM-DD')
      const endDate = req.query.endDate || dayjs().format('YYYY-MM-DD')
      const sender = req.query?.sender ? `%${req.query?.sender}%` : '%gov%'
      const [meetings, meetingsCount] = await Promise.all([
        sequelize.query(
          `
          SELECT C."name" AS country_name, COUNT(M."id") AS total,
            (
              SELECT COUNT(M1."id")
              FROM "Meetings" AS M1
              WHERE M1."platform_id" = 1
              AND M1."country_id" = C."id"
              AND M1."meeting_date" >= :startDate
              AND M1."meeting_date" <= :endDate
            ) AS zoom,
            (
              SELECT COUNT(M1."id")
              FROM "Meetings" AS M1
              WHERE M1."platform_id" = 1
              AND M1."country_id" = C."id"
              AND M1."sender" LIKE :sender
              AND M1."meeting_date" >= :startDate
              AND M1."meeting_date" <= :endDate
            ) AS zoom_specify,
            (
              SELECT COUNT(M2."id")
              FROM "Meetings" AS M2
              WHERE M2."platform_id" = 2
              AND M2."country_id" = C."id"
              AND M2."meeting_date" >= :startDate
              AND M2."meeting_date" <= :endDate
            ) AS webex,
            (
              SELECT COUNT(M2."id")
              FROM "Meetings" AS M2
              WHERE M2."platform_id" = 2
              AND M2."country_id" = C."id"
              AND M2."sender" LIKE :sender
              AND M2."meeting_date" >= :startDate
              AND M2."meeting_date" <= :endDate
            ) AS webex_specify,
            (
              SELECT COUNT(M3."id")
              FROM "Meetings" AS M3
              WHERE M3."platform_id" = 3
              AND M3."country_id" = C."id"
              AND M3."meeting_date" >= :startDate
              AND M3."meeting_date" <= :endDate
            ) AS tencent,
            (
              SELECT COUNT(M3."id")
              FROM "Meetings" AS M3
              WHERE M3."platform_id" = 3
              AND M3."country_id" = C."id"
              AND M3."sender" LIKE :sender
              AND M3."meeting_date" >= :startDate
              AND M3."meeting_date" <= :endDate
            ) AS tencent_specify,
            (
              SELECT COUNT(M4."sender")
              FROM "Meetings" AS M4
              WHERE M4."country_id" = C."id"
              AND M4."sender" LIKE :sender
              AND M4."meeting_date" >= :startDate
              AND M4."meeting_date" <= :endDate
            ) AS total_specify
          FROM "Meetings" AS M
          LEFT JOIN "Countries" AS C
            ON C."id" = M."country_id"
          WHERE M."country_id" IN
            (
              SELECT "id" 
              FROM "Countries"
            )
            AND M."meeting_date" >= :startDate
            AND M."meeting_date" <= :endDate
          GROUP BY c."id"
          LIMIT  :limit
          OFFSET :offset
          `,
          {
            replacements: {
              startDate: startDate,
              endDate: endDate,
              sender: sender,
              limit: limit,
              offset: offset
            },
            type: QueryTypes.SELECT
          }
        ),
        sequelize.query(
          `
          SELECT COUNT(M."id")
          FROM "Meetings" AS M
          LEFT JOIN "Countries" AS C
            ON C."id" = M."country_id"
          WHERE 
            M."meeting_date" >= :startDate
            AND M."meeting_date" <= :endDate
          GROUP BY c."id" 
          `,
          {
            replacements: {
              startDate: startDate,
              endDate: endDate
            },
            type: QueryTypes.SELECT
          }
        )
      ])

      res.locals.layout = 'table.hbs'
      res.render('analysis', {
        meetings,
        startDate,
        endDate,
        sender: req.query?.sender ? req.query.sender : 'gov',
        pagination: getPagination(limit, page, meetingsCount.length)
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
      const categoryId = Number(req.query.categoryId) || null
      const platformId = Number(req.query.platformId) || null
      const countryId = Number(req.query.countryId) || null
      const startDate = req.query.startDate || dayjs().format('YYYY-MM-DD')
      const endDate = req.query.endDate || dayjs().format('YYYY-MM-DD')

      const [meetings, meetingCount, categories, platforms, countries] = await Promise.all([
        sequelize.query(
          `
          SELECT 
            M."id",
            M."meeting_date",
            M."uuid",
            C."name" AS country_name,
            P."name" AS platform_name,
            M."name",
            M."organization",
            M."sender",
            M."receiver",
            CA."name" AS category_name,
            V."is_value",
            (
              SELECT CM."content"
              FROM "Comments" AS CM
              RIGHT JOIN "Users" AS U
              ON U."id" = CM."user_id"
              WHERE CM."meeting_id" = M."id"
              AND CM."group" = '6th'
            ) AS comment_content_6th
          FROM "Meetings" AS M
          LEFT JOIN "Values" AS V
            ON V."meeting_id" = M."id"
          LEFT JOIN "Countries" AS C
            ON C."id" = M."country_id"
          LEFT JOIN "Platforms" AS P
            ON P."id" = M."platform_id"
          LEFT JOIN "Categories" AS CA
            ON CA."id" = M."category_id"
          WHERE 
            (
              M."meeting_date" >= :startDate AND
              M."meeting_date" <= :endDate
            )
          AND
            (
              CASE
                WHEN :categoryId IS NOT NULL
                THEN M."category_id" = :categoryId
                ELSE M."category_id" in
                (
                  SELECT "id"
                  FROM "Categories"
                )
              END
            )
          AND 
            (
              CASE
                WHEN :platformId IS NOT NULL 
                  THEN M."platform_id" = :platformId
                  ELSE M."platform_id" in 
                  (
                  SELECT "id"
                  FROM "Platforms"
                )
                END
            )
          AND
            (
              CASE
                WHEN :countryId IS NOT NULL
                THEN M."country_id" = :countryId
                ELSE M."country_id" in
                (
                  SELECT "id"
                  FROM "Countries"
                )
              END
            )
          ORDER BY M."meeting_date" DESC
          LIMIT  :limit
          OFFSET :offset
          `,
          {
            replacements: {
              startDate: startDate,
              endDate: endDate,
              categoryId: categoryId,
              platformId: platformId,
              countryId: countryId,
              limit: limit,
              offset: offset
            },
            type: QueryTypes.SELECT
          }
        ),
        sequelize.query(
          `
          SELECT COUNT(M."id")
          FROM "Meetings" AS M
          WHERE 
            (
              M."meeting_date" >= :startDate AND
              M."meeting_date" <= :endDate
            )
          AND
            (
              CASE
                WHEN :categoryId IS NOT NULL
                THEN M."category_id" = :categoryId
                ELSE M."category_id" in
                (
                  SELECT "id"
                  FROM "Categories"
                )
              END
            )
          AND 
            (
              CASE
                WHEN :platformId IS NOT NULL 
                  THEN M."platform_id" = :platformId
                  ELSE M."platform_id" in 
                  (
                  SELECT "id"
                  FROM "Platforms"
                )
                END
            )
          AND
            (
              CASE
                WHEN :countryId IS NOT NULL
                THEN M."country_id" = :countryId
                ELSE M."country_id" in
                (
                  SELECT "id"
                  FROM "Countries"
                )
              END
            )
          `,
          {
            replacements: {
              startDate: startDate,
              endDate: endDate,
              categoryId: categoryId,
              platformId: platformId,
              countryId: countryId
            },
            type: QueryTypes.SELECT
          }
        ),
        Category.findAll({ raw: true }),
        Platform.findAll({ raw: true }),
        Country.findAll({ raw: true })
      ])

      // convert date format
      const newMeetings = meetings.map(meeting => ({
        ...meeting,
        name: meeting.name.length > 50 ? meeting.name.substring(0, 50) + '...' : meeting.name,
        receiver: meeting.receiver.length > 50 ? meeting.receiver.substring(0, 50) + '...' : meeting.receiver,
        meeting_date: dayjs(meeting.meeting_date).format('YYYY-MM-DD')
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
        pagination: getPagination(limit, page, meetingCount[0].count)
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
          M."receiver",
          M."uuid",
          M."content" AS meeting_content,
          (
            SELECT CM."content"
            FROM "Comments" AS CM
            RIGHT JOIN "Users" AS U
            ON U."id" = CM."user_id"
            WHERE CM."meeting_id" = M."id"
            AND CM."group" = '6th'
          ) AS comment_content_6th
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
        Comment.findOne({ where: { meetingId: id, group: '6th' } })
      ])

      if (!meeting) throw new Error("User didn't exist!")
      if (!comment) {
        await Promise.all([
          meeting.update({ uuid }),
          Comment.create({
            userId,
            group: '6th',
            meetingId: id,
            content
          })
        ])
      } else {
        await Promise.all([
          meeting.update({ uuid }),
          comment.update({
            content
          })
        ])
      }

      req.flash('success_messages', 'Success Update!')
      return res.redirect(`/meetings/6th/${id}`)
    } catch (err) {
      next(err)
    }
  },
  getSevenPage: async (req, res, next) => {
    try {
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || DEFAULT_LIMIT
      const offset = getOffset(limit, page)
      const categoryId = Number(req.query.categoryId) || null
      const platformId = Number(req.query.platformId) || null
      const countryId = Number(req.query.countryId) || null
      const startDate = req.query.startDate || dayjs().format('YYYY-MM-DD')
      const endDate = req.query.endDate || dayjs().format('YYYY-MM-DD')

      const [meetings, meetingCount, categories, platforms, countries] = await Promise.all([
        sequelize.query(
          `
          SELECT 
            M."id",
            M."meeting_date",
            M."uuid",
            C."name" AS country_name,
            P."name" AS platform_name,
            M."name",
            M."organization",
            M."sender",
            M."receiver",
            CA."name" AS category_name,
            MI."is_done",
            (
              SELECT CM."content"
              FROM "Comments" AS CM
              RIGHT JOIN "Users" AS U
              ON U."id" = CM."user_id"
              WHERE CM."meeting_id" = M."id"
              AND CM."group" = '6th'
            ) AS comment_content_6th
          FROM "Meetings" AS M
          LEFT JOIN "Minutes" AS MI
            ON MI."meeting_id" = M."id"
          LEFT JOIN "Countries" AS C
            ON C."id" = M."country_id"
          LEFT JOIN "Platforms" AS P
            ON P."id" = M."platform_id"
          LEFT JOIN "Categories" AS CA
            ON CA."id" = M."category_id"
          WHERE 
            (
              M."meeting_date" >= :startDate AND
              M."meeting_date" <= :endDate
            )
          AND
            (
              CASE
                WHEN :categoryId IS NOT NULL
                THEN M."category_id" = :categoryId
                ELSE M."category_id" in
                (
                  SELECT "id"
                  FROM "Categories"
                )
              END
            )
          AND 
            (
              CASE
                WHEN :platformId IS NOT NULL 
                  THEN M."platform_id" = :platformId
                  ELSE M."platform_id" in 
                  (
                  SELECT "id"
                  FROM "Platforms"
                )
                END
            )
          AND
            (
              CASE
                WHEN :countryId IS NOT NULL
                THEN M."country_id" = :countryId
                ELSE M."country_id" in
                (
                  SELECT "id"
                  FROM "Countries"
                )
              END
            )
          ORDER BY M."meeting_date" DESC
          LIMIT  :limit
          OFFSET :offset
          `,
          {
            replacements: {
              startDate: startDate,
              endDate: endDate,
              categoryId: categoryId,
              platformId: platformId,
              countryId: countryId,
              limit: limit,
              offset: offset
            },
            type: QueryTypes.SELECT
          }
        ),
        sequelize.query(
          `
          SELECT COUNT(M."id")
          FROM "Meetings" AS M
          WHERE 
            (
              M."meeting_date" >= :startDate AND
              M."meeting_date" <= :endDate
            )
          AND
            (
              CASE
                WHEN :categoryId IS NOT NULL
                THEN M."category_id" = :categoryId
                ELSE M."category_id" in
                (
                  SELECT "id"
                  FROM "Categories"
                )
              END
            )
          AND 
            (
              CASE
                WHEN :platformId IS NOT NULL 
                  THEN M."platform_id" = :platformId
                  ELSE M."platform_id" in 
                  (
                  SELECT "id"
                  FROM "Platforms"
                )
                END
            )
          AND
            (
              CASE
                WHEN :countryId IS NOT NULL
                THEN M."country_id" = :countryId
                ELSE M."country_id" in
                (
                  SELECT "id"
                  FROM "Countries"
                )
              END
            )
          `,
          {
            replacements: {
              startDate: startDate,
              endDate: endDate,
              categoryId: categoryId,
              platformId: platformId,
              countryId: countryId
            },
            type: QueryTypes.SELECT
          }
        ),
        Category.findAll({ raw: true }),
        Platform.findAll({ raw: true }),
        Country.findAll({ raw: true })
      ])

      // convert date format
      const newMeetings = meetings.map(meeting => ({
        ...meeting,
        name: meeting.name.length > 50 ? meeting.name.substring(0, 50) + '...' : meeting.name,
        receiver: meeting.receiver.length > 50 ? meeting.receiver.substring(0, 50) + '...' : meeting.receiver,
        meeting_date: dayjs(meeting.meeting_date).format('YYYY-MM-DD')
      }))

      res.locals.layout = 'table.hbs'
      res.render('7th', {
        meetings: newMeetings,
        categories,
        categoryId,
        platforms,
        platformId,
        countries,
        countryId,
        startDate,
        endDate,
        pagination: getPagination(limit, page, meetingCount[0].count)
      })
    } catch (err) {
      next(err)
    }
  },
  getSevenMeeting: async (req, res, next) => {
    try {
      const { id } = req.params
      const meeting = await sequelize.query(
        `
        SELECT
          M."id",
          M."name",
          M."receiver",
          M."uuid",
          M."content" AS meeting_content,
          (
            SELECT CM."content"
            FROM "Comments" AS CM
            RIGHT JOIN "Users" AS U
            ON U."id" = CM."user_id"
            WHERE CM."meeting_id" = M."id"
            AND CM."group" = '5th'
          ) AS comment_content_5th,
          (
            SELECT CM."content"
            FROM "Comments" AS CM
            RIGHT JOIN "Users" AS U
            ON U."id" = CM."user_id"
            WHERE CM."meeting_id" = M."id"
            AND CM."group" = '6th'
          ) AS comment_content_6th
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

      res.render('meeting-7th', { meeting: meeting[0] })
    } catch (err) {
      next(err)
    }
  },
  getSevenMeetingNewPage: async (req, res, next) => {
    try {
      const [countries, categories, platforms] = await Promise.all([
        Country.findAll({ raw: true }),
        Category.findAll({ raw: true }),
        Platform.findAll({ raw: true })
      ])
      res.locals.layout = 'meeting-new.hbs'
      res.render('seven-meeting-new', {
        countries,
        categories,
        platforms
      })
    } catch (err) {
      next(err)
    }
  },
  postSevenMeeting: async (req, res, next) => {
    try {
      const {
        name,
        country,
        category,
        platform,
        link,
        password,
        meetingDate,
        acceptanceDate,
        uuid
      } = req.body
      console.log(req.body)
      const [[countryResult], [categoryResult], [platformResult]] = await Promise.all([
        Country.findOrCreate({
          where: { name: country },
          raw: true
        }),
        Category.findOrCreate({
          where: { name: category },
          raw: true
        }),
        Platform.findOrCreate({
          where: { name: platform },
          raw: true
        })
      ])

      await Meeting.create({
        name: name.trim(),
        countryId: countryResult.id,
        categoryId: categoryResult.id,
        platformId: platformResult.id,
        link: link.trim(),
        password: password.trim(),
        meetingDate: meetingDate.trim(),
        acceptanceDate: acceptanceDate.trim(),
        uuid: uuid.trim(),
        receiver: '未知'
      })

      res.redirect('/meetings/7th')
    } catch (err) {
      next(err)
    }
  },
  putSevenMeeting: async (req, res, next) => {
    try {
      const { id } = req.params
      const uuid = req.body.uuid.trim()

      const meeting = await Meeting.findByPk(id)
      if (!meeting) throw new Error("User didn't exist!")

      await meeting.update({ uuid })
      req.flash('success_messages', 'Success Update!')
      return res.redirect(`/meetings/7th/${id}`)
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
      case '7th':
        res.redirect('/meetings/7th')
        break
      default:
        res.redirect('/meetings/5th')
    }
  },
  getFileContent: async (req, res, next) => {
    try {
      const { fileDate, fileName } = req.params
      const emailFile = fs.createReadStream(path.resolve(process.env.FILE_PATH, dayjs(fileDate).format('YYYYMMDD'), fileName))
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
      res.download(path.resolve(process.env.FILE_PATH, dayjs(fileDate).format('YYYYMMDD'), fileName))
    } catch (err) {
      next(err)
    }
  },
  postValue: async (req, res, next) => {
    try {
      const { id } = req.params
      const userId = Number(getUser(req).id)

      const [meeting, meetingValue] = await Promise.all([
        sequelize.query(
          `
          SELECT "id"
          FROM "Meetings"
          `,
          {
            type: QueryTypes.SELECT
          }
        ),
        sequelize.query(
          `
          SELECT "id"
          FROM "Values"
          WHERE "meeting_id" = :meetingId
          `,
          {
            replacements: {
              meetingId: Number(id)
            },
            type: QueryTypes.SELECT
          }
        )
      ])
      if (!meeting.length) throw new Error('您點選之會議不存在！')
      if (meetingValue.length) throw new Error('您點選之會議已錄存！')

      await sequelize.query(
        `
        INSERT INTO "Values"
          ("user_id", "meeting_id", "is_value", "created_at", "updated_at")
        VALUES (:userId, :meetingId, :isValue, :createdAt, :updatedAt)
        `,
        {
          replacements: {
            userId: userId,
            meetingId: id,
            isValue: true,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          type: QueryTypes.INSERT
        }
      )
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
      if (!meeting) throw new Error('您點選之會議不存在！')
      if (!meetingValue) throw new Error('您點選之會議尚未錄存！')

      await meetingValue.destroy()
      res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  postMinutes: async (req, res, next) => {
    try {
      const { id } = req.params
      const userId = Number(getUser(req).id)

      const [meeting, meetingMinutes] = await Promise.all([
        sequelize.query(
          `
          SELECT "id"
          FROM "Meetings"
          `,
          {
            type: QueryTypes.SELECT
          }
        ),
        sequelize.query(
          `
          SELECT "id"
          FROM "Minutes"
          WHERE "meeting_id" = :meetingId
          `,
          {
            replacements: { meetingId: Number(id) },
            type: QueryTypes.SELECT
          }
        )
      ])

      if (!meeting.length) throw new Error('您點選之會議不存在！')
      if (meetingMinutes.length) throw new Error('您點選之會議已有會議紀錄文本！')

      await sequelize.query(
        `
        INSERT INTO "Minutes"
          ("user_id", "meeting_id", "is_done", "created_at", "updated_at")
        VALUES (:userId, :meetingId, :isDone, :createdAt, :updatedAt)
        `,
        {
          replacements: {
            userId: userId,
            meetingId: id,
            isDone: true,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          type: QueryTypes.INSERT
        }
      )
      res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  deleteMinutes: async (req, res, next) => {
    try {
      const { id } = req.params

      const [meeting, meetingMinutes] = await Promise.all([
        Meeting.findByPk(id),
        Minute.findOne({
          where: {
            meetingId: Number(id),
            isDone: true
          }
        })
      ])
      if (!meeting) throw new Error('您點選之會議不存在！')
      if (!meetingMinutes) throw new Error('您點選之會議尚未擁有會議紀錄文本！')

      await meetingMinutes.destroy()
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
